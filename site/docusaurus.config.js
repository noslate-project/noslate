// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Noslate',
  tagline: 'Midway is a fullstack framework for web & Serverless',
  url: 'https://noslate.midwayjs.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'noslate', // Usually your GitHub org/user name.
  projectName: 'Noslate', // Usually your repo name.
  stylesheets: ['//at.alicdn.com/t/font_2797741_dnh1sm1jan.css'],
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
          editUrl: 'https://github.com/AlibabaIncubator/noslate/tree/main/site/',
          versions: {
            current: {
              label: '3.0.0',
            },
          },
          lastVersion: 'current',
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
        title: 'Midway',
        logo: {
          alt: 'midway logo',
          src: 'img/logo.svg',
        },
        items: [
          ...require('./lib/navbar'),
          {
            href: 'https://github.com/AlibabaIncubator/noslate',
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
