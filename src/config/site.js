import {themes as prismThemes} from 'prism-react-renderer';
import {documentInstances, docsPluginOptions} from './document-instances.js';
import {SITE_ROUTES, normalizePath} from '../app/routes.js';
import {documentDates} from '../app/logic/document-dates.js';
import {documentLocation} from '../app/logic/document-location.js';
import libraryNavigation from './plugins/navigation.js';
import recentUpdates from './plugins/recent-updates.js';
import generatedModuleCompat from './plugins/generated-module-compat.js';
import {createRequire} from 'node:module';

const {version} = createRequire(import.meta.url)('../../package.json');

// Shared starter branding. Change this once for the site and navbar titles.
const siteTitle = 'Docnest';

// Public starter defaults. Set your own URL and branding before publishing.
// For `docusaurus deploy` to GitHub Pages, add your own organizationName and
// projectName here. The starter does not select a deployment account or repository.
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: siteTitle,
  customFields: {version},
  tagline: 'A space for personal knowledge and project documentation',
  favicon: 'img/icon.svg',
  staticDirectories: ['public'],
  url: 'https://example.com',
  baseUrl: '/',
  future: {v4: true},
  storage: {type: 'localStorage', namespace: 'docnest'},
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'throw',
  markdown: {format: 'detect', mermaid: true},
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'ja'],
    path: 'documents/_translations',
    localeConfigs: {
      en: {label: 'English', htmlLang: 'en'},
      ko: {label: '한국어', htmlLang: 'ko'},
      ja: {label: '日本語', htmlLang: 'ja'},
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en', 'ko', 'ja'],
        indexBlog: false,
        docsRouteBasePath: documentInstances.map(({routeBasePath}) => routeBasePath),
        docsDir: documentInstances.map(({path}) => path),
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: docsPluginOptions(documentInstances.find(({id}) => id === 'default')),
        blog: false,
        sitemap: false,
        theme: {customCss: './src/app/styles/custom.scss'},
      },
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    generatedModuleCompat,
    [libraryNavigation, {normalizePath, documentDates, documentLocation}],
    [
      recentUpdates,
      {
        documentDates,
        labels: Object.fromEntries(documentInstances.map(({id, label}) => [id, label])),
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: ['always'],
        pwaHead: [
          {tagName: 'link', rel: 'manifest', href: '/manifest.json'},
          {tagName: 'meta', name: 'theme-color', content: '#333333'},
          {tagName: 'link', rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png'},
          {tagName: 'link', rel: 'mask-icon', href: '/img/mask-icon.svg', color: '#2e6348'},
        ],
      },
    ],
    ...documentInstances
      .filter(({id}) => id !== 'default')
      .map((instance) => ['@docusaurus/plugin-content-docs', docsPluginOptions(instance)]),
  ],
  themeConfig: {
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: false},
    navbar: {
      title: siteTitle,
      logo: {
        alt: siteTitle,
        src: 'img/icon-light.svg',
        srcDark: 'img/icon-dark.svg',
        width: 30,
        height: 30,
      },
      items: [
        {type: 'custom-sidebarToggle', position: 'left'},
        {
          to: SITE_ROUTES.home,
          label: 'Home',
          position: 'right',
          activeBasePath: '/',
          activeBaseRegex: '^/(ko/|ja/)?$',
        },
        {type: 'custom-languageDropdown', position: 'right'},
      ],
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};

export default config;
