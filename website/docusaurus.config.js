// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Jordy',
  tagline: 'FrontEnd Toolkit with Typescript',
  url: 'https://thesoncriel.github.io',
  baseUrl: '/jordy/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'thesoncriel', // Usually your GitHub org/user name.
  projectName: 'jordy', // Usually your repo name.
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      navbar: {
        title: 'Jordy',
        logo: {
          alt: 'jordy logo',
          src: 'img/logo.png',
        },
        items: [
          {
            to: '/docs/introduce',
            label: 'Docs',
            position: 'left',
          },
          { to: '/docs/api', label: 'API', position: 'left' },
          {
            href: 'https://github.com/thesoncriel/jordy',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'API',
                to: '/docs/api',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/thesoncriel/jordy',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} thesoncriel, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },
};

module.exports = config;
