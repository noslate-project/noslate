'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

const express = require('express');
const _ = require('lodash');
const ejs = require('ejs');

const {
    NOSLATE_PATH,
    PORT
} = process.env;

const { NoslatedClient } = require(NOSLATE_PATH);

const FUNCTIONS_DIR = path.join(__dirname, '../functions');
const FUNCTION_PROFILES_PATH = path.join(FUNCTIONS_DIR, 'profiles.json');
let FUNCTION_PROFILES = JSON.parse(fs.readFileSync(FUNCTION_PROFILES_PATH));

class Gateway {
    constructor() {
        this.port = PORT || 3000;

        this.logger = console;

        this.agent = new NoslatedClient();

        if (!fs.existsSync(FUNCTIONS_DIR)) {
            fs.mkdirSync(FUNCTIONS_DIR);
        }
    }

    render(template, context) {
        return template.replace(/\{\{(.*?)\}\}/g, (_, key) => context[key] || '');
    };

    renderUrls(profile) {
        profile.forEach(v => {
            if (v.url.startsWith('http:')) {
                return;
            }

            const tmpPath = this.render(v.url, { FUNCTION_DIR: FUNCTIONS_DIR });
            v.url = url.pathToFileURL(path.normalize(tmpPath)).href;
        });
    }

    getFunctionHeaders(req) {
        let ret;
        const b64 = req.get('x-noslated-headers');
        if (!b64) {
            ret = [];
        } else {
            const jsonStr = Buffer.from(b64, 'base64').toString();
            try {
                ret = JSON.parse(jsonStr);
            } catch (e) {
                ret = [];
            }
        }

        let host;
        let referer;
        let cookie;
        let userAgent;
        let xForwardedFor = '';
        for (const pair of ret) {
            switch (pair[0].toLowerCase()) {
                case 'host': host = pair[1]; break;
                case 'referer':
                case 'referrer': referer = pair[1]; break;
                case 'x-forwarded-for': {
                    xForwardedFor = pair[1];
                    break;
                }
                case 'cookie': cookie = pair[1]; break;
                case 'user-agent': userAgent = pair[1]; break;
                default: break;
            }
        }

        if (!host) {
            host = req.get('host');
            if (host) ret.push(['host', host]);
        }

        if (!referer) {
            referer = req.get('referer') || req.get('referrer');
            if (referer) ret.push(['referer', referer]);
        }

        if (!cookie) {
            cookie = req.get('cookie');
            if (cookie) ret.push(['cookie', cookie]);
        }

        if (!userAgent) {
            userAgent = req.get('user-agent');
            if (userAgent) ret.push(['user-agent', userAgent]);
        }

        if (xForwardedFor) {
            xForwardedFor += ', ';
        }
        xForwardedFor += req.socket.address().address;
        _.remove(ret, pair => pair[0].toLowerCase() === 'x-forwarded-for');
        ret.push(['x-forwarded-for', xForwardedFor]);

        return ret;
    }

    async setFunctionProfile(profile, mode = 'IMMEDIATELY') {
        const _profile = _.cloneDeep(profile);
        await this.agent.setFunctionProfile(_profile, mode);
    }

    async initHTTPServer() {
        this.app = express();

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.all('/', async (req, res) => {
            const html = await fs.promises.readFile(path.join(__dirname, 'static', 'index.ejs'), 'utf-8');
            res.set('Content-Type', 'text/html');
            res.end(ejs.render(html, {
                functions: FUNCTION_PROFILES
            }));
        });

        this.app.all('/invoke/:id', async (req, res) => {
            const start = Date.now();
            let end;

            const name = req.params.id;

            if (!name) {
                res.status(400);
                return res.end('function name required');
            }

            const { method, url } = req;
            const headers = this.getFunctionHeaders(req);
            const metadata = {
                headers,
                method,
                url
            };

            let response;

            try {
                response = await this.agent.invoke(name, req, metadata);
                // TODO(Umuoy): use pipeline
                response.pipe(res);
                end = Date.now();
            } catch (e) {
                end = Date.now();
                this.logger.warn(`Request ${req.path} failed.`);
                this.logger.warn(e);
                this.logger.info('Current request failed, duration:', end - start);
                res.set('x-funciton-duration', end - start);
                res.status((e.status && e.status > 0) ? e.status : 500);
                return res.end(e.stack);
            }

            res.set('x-funciton-duration', end - start);
            res.status(response.status);

            for (const [key, value] of response.metadata.headers) {
                res.appendHeader(key, value);
            }

            this.logger.info('Current request duration:', end - start);
        });

        this.app.get('/listFunctions', async (req, res) => {
            res.json(FUNCTION_PROFILES);
        });

        this.app.get('/function/:id', async (req, res) => {
            const name = req.params.id;

            const function_profiles = JSON.parse(await fs.promises.readFile(FUNCTION_PROFILES_PATH));
            const _profile = function_profiles.find((v, _) => v.name === name);

            if (!_profile) {
                res.status(404);
                return res.end(`function ${name} not found`);
            }

            this.renderUrls([_profile]);

            const ret = {
                function_profile: _profile
            };

            if (_profile.url.startsWith('file:')) {
                ret.code = await fs.promises.readFile(path.join(url.fileURLToPath(_profile.url), _profile.sourceFile), 'utf-8');
            }

            res.json(ret);
        });

        this.app.post('/invokeService', async (req, res) => {
            res.send('TODO');
        });

        this.app.listen(this.port, () => {
            this.logger.info(`Gateway service listening on ${this.port}`);
        });
    }

    async start() {
        await this.agent.start();

        await this.initHTTPServer();

        this.renderUrls(FUNCTION_PROFILES);

        await this.setFunctionProfile(FUNCTION_PROFILES, 'IMMEDIATELY');

        fs.watch(FUNCTION_PROFILES_PATH, { persistent: true }, async (type, filename) => {
            this.logger.info(`Watching ${filename} changed`);

            if (filename !== path.basename(FUNCTION_PROFILES_PATH)) {
                return;
            }

            const profile = JSON.parse(await fs.promises.readFile(FUNCTION_PROFILES_PATH, 'utf-8'));
            this.renderUrls(profile);

            if (!_.isEqual(profile, FUNCTION_PROFILES)) {
                FUNCTION_PROFILES = profile;
                this.setFunctionProfile(FUNCTION_PROFILES, 'IMMEDIATELY');
            }

        });
    }
}

const gateway = new Gateway();
gateway.start();
