import {createRequire} from 'node:module';
import {createDinoConfig} from '@dino-ovum/preset/config';

const {version} = createRequire(import.meta.url)('./package.json');

// Shared starter branding. Change this once for the site and navbar titles.
const siteTitle = 'Docnest';

// First argument: Docusaurus site settings. Second argument: Dino Ovum options.
// Shared layouts, navigation, search, and styles come from @dino-ovum/preset.
export default createDinoConfig(
  {
    title: siteTitle,
    tagline: 'A space for personal knowledge and project documentation',
    favicon: 'img/icon.svg',
    // Public starter defaults. Set your own URL before publishing.
    // For a subpath such as '/handbook/', change baseUrl; PWA paths below follow it.
    url: 'https://example.com',
    baseUrl: '/',
    customFields: {version},
    // Keep the existing namespace so saved color mode and sidebar state survive.
    storage: {type: 'localStorage', namespace: 'docnest'},
    themeConfig: {
      navbar: {
        logo: {
          alt: siteTitle,
          src: 'img/icon-light.svg',
          srcDark: 'img/icon-dark.svg',
          width: 30,
          height: 30,
        },
      },
    },
  },
  {
    // Global site styles, loaded after the Dino Ovum theme.
    customCss: './src/globals.scss',
    pwa: {
      manifest: {
        orientation: 'any',
        icons: [
          {src: 'img/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any'},
          {src: 'img/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
          {src: 'img/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
          {src: 'img/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
        ],
      },
      // Keep these paths relative: the PWA plugin prefixes each locale's baseUrl.
      pwaHead: [
        {tagName: 'link', rel: 'apple-touch-icon', href: 'img/apple-touch-icon.png'},
        {tagName: 'link', rel: 'mask-icon', href: 'img/mask-icon.svg', color: '#2e6348'},
      ],
    },
  },
);
