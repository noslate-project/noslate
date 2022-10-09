// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Noslate Project',
  tagline: 'Noslate is an elegant, modern and fully customizable serverless runtime. ',
  url: 'https://noslate.midwayjs.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'noslate-project', // Usually your GitHub org/user name.
  projectName: 'noslate', // Usually your repo name.
  stylesheets: ['//at.alicdn.com/t/a/font_2797741_l39t8bs3w1r.css'],
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
  },
  plugins: ['./lib/plugin.js'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./docs/sidebars.json'),
          // Please change this to your repo.
          editUrl: 'https://github.com/noslate-project/noslate/tree/main/site/',
          sidebarCollapsed: false,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      favicon: 'img/logo.svg',
      metadata: [
        {
          name: 'referrer',
          content: 'no-referrer',
        },
      ],
      navbar: {
        title: 'Noslate',
        logo: {
          alt: 'noslate logo',
          src: 'img/logo.svg',
        },
        items: [
          ...require('./lib/navbar'),
          {
            href: 'https://github.com/noslate-project/noslate',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      algolia: {
        appId: 'DHOMYJQQ2W',
        apiKey: '75f3dce231a9777ae8fa6fba6b82085b',
        indexName: 'midway',
        contextualSearch: true,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
