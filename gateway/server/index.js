'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const { pipeline } = require('stream/promises');

const express = require('express');
const _ = require('lodash');
const ejs = require('ejs');

const {
    ALICE_WORKDIR,
    PORT
} = process.env;

const BUILD_DIR = path.join(ALICE_WORKDIR, 'build/');

const FUNCTION_PROFILE_FILE = 'MOCK_FUNCTION_PROFILE.json';
const functionProfileFile = path.join(__dirname, FUNCTION_PROFILE_FILE);
const functionsDir = path.join(__dirname, 'functions/');

let FUNCTION_PROFILE = JSON.parse(fs.readFileSync(functionProfileFile));

const { AliceAgent } = require(path.join(BUILD_DIR, 'sdk'));

class Gateway {
    constructor() {
        this.port = PORT || 3000;

        this.logger = console;

        this.agent = new AliceAgent();

        if (!fs.existsSync(functionsDir)) {
            fs.mkdirSync(functionsDir);
        }
    }
    getFunctionHeaders(req) {
        let ret;
        const b64 = req.get('x-alice-headers');
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
            res.end(ejs.render(html, {
                functions: FUNCTION_PROFILE
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
                await pipeline(response, res);
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
            res.json(FUNCTION_PROFILE);
        });

        this.app.get('/function/:id', async (req, res) => {
            const name = req.params.id;

            const function_profiles = JSON.parse(await fs.promises.readFile(functionProfileFile));
            const _profile = function_profiles.find((v, _) => v.name === name);

            if (!_profile) {
                res.status(404);
                return res.end(`function ${name} not found`);
            }

            const ret = {
                function_profile: _profile
            };

            if (_profile.url.startsWith('file:')) {
                ret.code = await fs.promises.readFile(path.join(url.fileURLToPath(_profile.url), _profile.sourceFile), 'utf-8');
            }

            res.json(ret);
        });

        this.app.post('/newFunction', async (req, res) => {
            const { code, function_profile } = req.body;

            if (!function_profile || (!code && !function_profile.url.startsWith('http'))) {
                res.status(400);
                return res.end('code or function_profile required');
            }

            const name = function_profile.name;

            const function_profiles = JSON.parse(await fs.promises.readFile(functionProfileFile));
            const _profile = function_profiles.find((v, _) => v.name === name);

            if (_profile) {
                res.status(400);
                return res.end(`function named ${name} already exists`);

            }

            if (!function_profile.url.startsWith('http')) {
                const codePath = path.join(functionsDir, function_profile.name);

                if (!fs.existsSync(codePath)) {
                    await fs.promises.mkdir(codePath);
                }

                await fs.promises.writeFile(path.join(codePath, function_profile.sourceFile), code);

                function_profile.url = url.pathToFileURL(path.join(functionsDir, function_profile.name));
                function_profiles.push(function_profile);

            }

            try {
                await fs.promises.writeFile(functionProfileFile, JSON.stringify(function_profiles, null, 2));
            } catch (e) {
                this.logger.error(e);
                res.status(400);
                return res.end(`new function ${name} failed`);
            }

            res.send('Success');
        });

        this.app.post('/remove/:id', async (req, res) => {
            const name = req.params.id;

            if (!name) {
                res.status(400);
                return res.end('function or service name required');
            }

            const function_profiles = _.cloneDeep(JSON.parse(await fs.promises.readFile(functionProfileFile)));

            let index;

            const _profile = function_profiles.find((v, i) => {
                index = i;
                return v.name === name;
            });

            if (!_profile) {
                res.status(400);
                return res.end(`function named ${name} not exists`);
            }

            try {
                function_profiles.splice(index, 1);
                await fs.promises.writeFile(functionProfileFile, JSON.stringify(function_profiles, null, 2));

                if (_profile.url.startsWith('file')) {
                    const codePath = url.fileURLToPath(_profile.url);
                    await fs.promises.rm(codePath, {
                        recursive: true,
                        force: true,
                    });
                }

            } catch (e) {
                this.logger.warn(`Remove function ${name} failed`);
                this.logger.warn(e);
            }

            return res.send('Success');

        });

        this.app.post('/invokeService', async (req, res) => {
            // TODO
        });

        this.app.listen(this.port, () => {
            this.logger.info(`Gateway service listening on ${this.port}`);
        });
    }

    async start() {
        await this.initHTTPServer();
        await this.setFunctionProfile(FUNCTION_PROFILE, 'IMMEDIATELY');

        for (const client of this.agent.dataPlaneClientManager.clients()) {
            await client.ready();
        }

        fs.watch(functionProfileFile, { persistent: true }, async (type, filename) => {
            this.logger.info(`Watching ${filename} changed`);
            if (filename !== path.basename(functionProfileFile)) return;
            const tmp = JSON.parse(await fs.promises.readFile(functionProfileFile, 'utf-8'));
            if (!_.isEqual(tmp, FUNCTION_PROFILE)) {
                FUNCTION_PROFILE = tmp;
                this.setFunctionProfile(FUNCTION_PROFILE, 'IMMEDIATELY');
            }

        });
    }
}

const gateway = new Gateway();
gateway.start();