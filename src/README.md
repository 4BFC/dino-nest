# Source structure

Keep Docusaurus integration points intact and organize implementation by responsibility.

```text
src/
├── theme/               Adapters that wrap or replace Docusaurus theme components
├── pages/               File-based React page entry points
│   └── _updates.jsx     Optional recent-updates example, disabled by default
├── config/              Node configuration and document registration
│   └── plugins/         Navigation data, recent updates, and ESM compatibility
└── app/
    ├── Root.jsx         Providers and development tools
    ├── DevTools.jsx     Development-only Agentation
    ├── routes.js        Shared URLs and route comparisons
    ├── components/      Layouts, screens, and reusable UI
    ├── hooks/           React state and data connections
    ├── providers/       Context and providers
    ├── logic/           Pure calculations independent of the runtime
    └── styles/          Global defaults, tokens, and SCSS Modules
```

## Integration

The root `docusaurus.config.js` exports `config/site.js`. Docusaurus owns routing and rendering;
`theme` and `pages` connect it to the React implementation in `app`.
The docs plugin and document `slug` define document URLs; files in `pages` define React page URLs.
`app/routes.js` stores URL constants and comparisons, not a router. Use Docusaurus locale utilities for localized URLs.

`theme/Root.jsx` → `app/Root.jsx` → `providers/AppProviders.jsx` → `SidebarVisibilityProvider` wraps the app.
The provider shares desktop sidebar state between page navigations. The mobile drawer uses Docusaurus state.
Do not add a separate BrowserRouter.

## Screens and data

`components/LibraryLayout` shares sidebar and content layout between document and React pages.
`components/navigation` owns navigation UI; `components/ui` owns badges, dates, and filter chips.
`DocumentTable` and `DocumentPagination` compose document lists, and `DocumentCategoryPage` renders folder index pages.
`SpaceOverview` optionally renders navigation entries as cards. `HomeHeading` uses the navbar logo configuration and package version.

`config/document-instances.js` registers content roots; the default is this repository's `documents` directory.
`config/plugins/navigation.js` builds navigation and lists from public document metadata.
React reads `sidebar`, `paths`, `documentEntries`, and `categoryLabels` through `usePluginData('library-navigation')`.
Draft and unlisted documents are excluded from navigation and recent updates. Unlisted status is not access control.

Document paths, categories, dates, and pagination calculations belong in `logic`.
Node file access belongs in plugins; DOM measurement and state updates belong in hooks.
Browser code must not import Node configuration.

## Internationalization

English source documents live in `documents/`. Korean and Japanese documents and UI messages live in
`documents/_translations/ko/` and `documents/_translations/ja/`, using Docusaurus's plugin directory layout.
The locale codes are `en`, `ko`, and `ja`; repository guide directories `language/eng` and `language/jp` are not locale codes.

The language selector reuses Docusaurus's alternate-page URL utility and preserves the current route, query, and fragment.
Each locale is a separate application, so language links perform a full navigation.
Custom UI strings use `@docusaurus/Translate`. Document dates use the active locale.
Navigation uses Docusaurus's source-relative directory metadata and localized category files, keeping translation storage paths out of the UI.

## Styles

All CSS and SCSS belong in `app/styles`. Shared tokens live in `tokens`; `custom.scss` is the global entry point.
Component SCSS Modules live in `styles/components`, Docusaurus class overrides in `styles/theme`,
and MDX home styles in `styles/pages`. Verify shared styles and accessibility in the rendered interface.

See [CONTRIBUTING](../CONTRIBUTING.md) for development, checks, multilingual previews, and the ESM compatibility rationale.
