# Contributing to Docnest

<div align="center">
<table align="center">
  <tr>
    <td align="center"><a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/English-0969DA?style=flat-square" alt="English"></a></td>
    <td align="center"><a href="../ko/CONTRIBUTING.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-555555?style=flat-square" alt="한국어"></a></td>
    <td align="center"><a href="../jp/CONTRIBUTING.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-555555?style=flat-square" alt="日本語"></a></td>
  </tr>
</table>
</div>

This guide covers development, checks, and publishing. For the product and everyday use, read [README](./README.md).
Run all commands below from the repository root.

## Contents

- [Development setup](#development-setup)
- [Site structure](#site-structure)
- [Documents and pages](#documents-and-pages)
- [Optional features](#optional-features)
- [Checks](#checks)
- [Writing documentation](#writing-documentation)
- [Compatibility](#compatibility)
- [Contribution workflow](#contribution-workflow)
- [Publishing](#publishing)
- [License](#license)

## Development setup

Use Node.js 24 (`>=24.22.1 <25`) and pnpm 10.5.2, as declared in [package.json](../../package.json).
If you use nvm, the repository's [.nvmrc](../../.nvmrc) selects Node.js 24:

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm start
```

Without nvm, install a compatible Node.js version first. See the [pnpm installation guide](https://pnpm.io/installation) if needed.
The development server normally opens at `http://localhost:3000`. If that port is occupied:

```bash
pnpm start --port 3100 --no-open
```

Keep dependency changes intentional and update the lockfile when changing dependencies.

## Site structure

Shared layouts, navigation, styles, fonts, default UI translations, and build plugins come from
[Dino Ovum](https://github.com/4BFC/dino-ovum) packages. This repository keeps only what you customize.

| Location | Responsibility |
| --- | --- |
| `docusaurus.config.js` | Site name, URL, logo, locales, and Dino Ovum options |
| `documents` | Publishable site content and translations |
| `public` | Logo, icons, and other static files |
| `src` | Your styles and shared-component wrappers; see [the `src` folder](#the-src-folder) |

```text
docusaurus.config.js
  → createDinoConfig(site settings, Dino Ovum options)
      → @dino-ovum/preset: documents, sidebars, search, PWA, navigation, and recent updates
          → @dino-ovum/theme: layouts, navigation, styles, fonts, and default UI translations
  → files in src/theme take precedence over the shared theme
```

The first argument of `createDinoConfig` is the Docusaurus site configuration. Objects merge with the shared defaults;
arrays such as `navbar.items` replace them. The second argument selects `documents`, `customCss`, `search`, `pwa`, and `updates`.
See the [Dino Ovum configuration guide](https://github.com/4BFC/dino-ovum/blob/main/docs/configuration.md) (Korean) for each option.

### The `src` folder

Each location in `src` has one role and includes a file to start from. Change the examples to fit your site.

| Location | Role | Included file |
| --- | --- | --- |
| `src/globals.scss` | Global styles, applied after the shared theme | Commented examples for colors, fonts, and layout |
| `src/styles` | Module styles (`*.module.scss`) that apply only where imported | `custom.module.scss`: the `.note` class |
| `src/theme` | Wrappers or replacements for shared components | `Root.jsx`: loads Agentation |

```text
src/globals.scss → customCss in docusaurus.config.js → every page
src/styles/custom.module.scss → only the MDX or src/theme files that import it
```

Docusaurus fixes the role of `src/theme`: a file there replaces the shared component at the same path.

To extend a shared component, add a file at the same path in `src/theme` and wrap the original:

```jsx
// src/theme/DinoOvum/HomeHeading.jsx
import OriginalHomeHeading from '@theme-original/DinoOvum/HomeHeading';

export default function HomeHeading() {
  return (
    <>
      <OriginalHomeHeading />
      <p>A note for this site.</p>
    </>
  );
}
```

A wrapper keeps receiving package improvements; a full replacement does not. MDX and pages import shared components from
`@theme/DinoOvum/`: `HomeHeading`, `DocumentTable`, `LibraryLayout`, `Updates`, and `UpdatesPage`.
VS Code settings use the repository's Prettier and ESLint configuration.

## Documents and pages

The content root is `documents`, the Dino Ovum default. To use another directory, set `documents.path`
in the second argument of `createDinoConfig`; the translation directory moves under it.
The starter includes `/`, `/license`, and `/standard/readme-style-standard`. Add Markdown or MDX with metadata such as:

```md
---
title: First note
description: A short description of this page.
slug: /notes/first-note
sidebar_position: 1
created_at: 2026-11-09
updated_at: 2026-11-09
---

Write your content here.
```

Use relative document links with file extensions. `_category_.json` controls folder `position` and `label`;
a folder's `index.mdx` can serve as its document-list entry point. Dates come from frontmatter, not Git history.

For a React page, add a file to `src/pages`; for example, `src/pages/about.jsx` creates `/about`.
Wrap it in `@theme/Layout` and `@theme/DinoOvum/LibraryLayout` to share the document layout.
Keep private documents, credentials, build output, and other repositories' Git history out of this template.

English source documents live in `documents/`. Docusaurus uses locales `en`, `ko`, and `ja`:

```text
documents/
├── home.mdx
├── license.mdx
├── standard/
└── _translations/
    ├── ko/
    │   ├── docusaurus-theme-classic/navbar.json
    │   └── docusaurus-plugin-content-docs/current/
    └── ja/
        ├── docusaurus-theme-classic/navbar.json
        └── docusaurus-plugin-content-docs/current/
```

Keep translated file names, slugs, and explicit heading IDs aligned with the English originals. `_translations` is excluded from the English document tree.
Store navbar labels in `docusaurus-theme-classic/navbar.json`. Korean and Japanese UI messages come from `@dino-ovum/theme`;
to change one, add the same key to `code.json` in that locale, which takes precedence.
The language selector uses Docusaurus locale URLs, preserving the current document, query, and fragment.
Repository guide folders `language/eng`, `language/ko`, and `language/jp` are separate from site locales.
The navbar and home heading share the logo paths in `docusaurus.config.js`; the home version comes from `package.json`.

Docusaurus development serves one locale at a time:

```bash
pnpm start --locale ko --port 3100 --no-open
```

Use the complete build to test switching between all three languages:

```bash
pnpm build
pnpm serve --host 127.0.0.1 --port 4173 --no-open
```

Open `/`, `/ko/`, and `/ja/` on the preview server. Use the same route suffix for translated documents.

## Optional features

To enable Recent Updates, set `updates: true` in the second argument of `createDinoConfig` in `docusaurus.config.js`.
It adds the `/updates` page and its navbar shortcut with the shared layout, filters, and date lists.
If you set `navbar.items` yourself, include `{type: 'custom-recentUpdates', position: 'right'}`.

Agentation is included so you can review the site with an AI agent while developing.
It loads only in the development server through `src/theme/Root.jsx`; Dino Ovum packages do not include it. To connect its local server:

```bash
pnpm agentation
```

In a separate terminal, check it with `pnpm agentation:doctor`. The default endpoint is `http://localhost:4747`.
Verify the server, browser synchronization, and MCP connection separately. Resolve feedback only after checking the original target and the result.

## Checks

```bash
pnpm format:check
pnpm build
pnpm serve --port 4173
```

`pnpm build` runs ESLint and Stylelint before checking links and generating the static site.
Use `pnpm lint` to run lint checks alone. Use `pnpm format`, `pnpm lint:js:fix`, or `pnpm lint:css:fix`
for intentional formatting or fixes, then review the diff. This starter does not include a dedicated test suite or CI workflow.

Development uses `.docusaurus-dev`; production builds use `.docusaurus`. Keep static preview on a different port from development.
Verify search and PWA behavior with the production preview. If an old service worker affects a preview, inspect that origin's registration and cache.
For UI changes, check desktop and mobile, both color modes, expanded and collapsed navigation, and reload behavior.
Confirm that generated home and license HTML contains the actual page content, not just an empty shell.

```bash
git diff --check
git diff --stat
git status --short
```

New, untracked files need separate review because ordinary `git diff` does not include them.

## Writing documentation

Follow the [README style standard](../../documents/standard/readme-style-standard.md).
README is the user manual: product, concise specifications, installation, and usage.
CONTRIBUTING covers development, site structure, checks, commits, and publishing.
Dino Ovum package internals are documented in the [Dino Ovum repository](https://github.com/4BFC/dino-ovum).

Keep English, Korean, and Japanese guides equivalent, including commands and version badges.
The root English guides and `language/eng/` contain the same content with adjusted relative links.
Use centered language badges that link to the same document type, with the current language highlighted.
Check headings, tables, badges, code blocks, the contents list, and relative links in Markdown preview.
Use a `<picture>` logo with dark and light SVG sources at the top of each README.
Keep README and CONTRIBUTING at the root and in `language/`. Shared writing standards belong in `documents/standard/` and are published on the site; do not create a separate `docs/` directory.

## Compatibility

`@dino-ovum/preset` 0.1.0 supports Docusaurus 3.10.1, React 19, and Node.js `>=24.22.1 <25`.
The preset includes the Docusaurus build compatibility plugins, so this repository does not keep its own.
Upgrade `@docusaurus/core` only together with a preset version that supports it.
Keep `browserslist` in `package.json`; without it, the build can fail when Babel transforms Mermaid's optional imports for older browsers.
Do not patch installed packages. Report shared problems in [Dino Ovum Issues](https://github.com/4BFC/dino-ovum/issues).

## Contribution workflow

Use [GitHub Issues](https://github.com/4BFC/docnest/issues) for questions, reproducible bugs, and proposals.
Keep each change focused on the agreed problem, preserve unrelated work, and include the relevant checks and UI screenshots in a pull request.
Review the diff before committing. When working with an AI agent, staging and commits require an explicit user instruction;
commit messages must not include `Co-Authored-By`. Publishing and pushing are separate actions.

Keep `.env` files, local Claude/Codex settings, and AI instruction files on your machine; `.gitignore` excludes them.
Shared development guidance belongs in this guide.

## Publishing

Set the real public URL in `docusaurus.config.js` before publishing. Static hosts use `pnpm build` and the `build` output directory.
The default `baseUrl` is `/`. For a subpath, change `baseUrl`; the PWA manifest, its icon paths, and `pwaHead` links follow it.
Verify the build at that path.

Customize branding in `public/img`, `public/favicon.ico`, `public/apple-touch-icon.png`, and the `pwa` option in `docusaurus.config.js` as applicable.
Do not commit hosting credentials or personal account settings.
Shared design and feature improvements arrive when you update `@dino-ovum/preset` and the lockfile, then rebuild and redeploy.
Changes to this template's own files, such as README, CONTRIBUTING, and configuration, are not applied automatically.

## License

Preserve the [MIT license](../../LICENSE), copyright notice, and third-party notices.
The Pretendard font and [its license](https://github.com/4BFC/dino-ovum/blob/main/packages/theme/src/assets/fonts/pretendard/LICENSE) are bundled in `@dino-ovum/theme`.
