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
- [Source responsibilities](#source-responsibilities)
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

## Source responsibilities

Follow [src/README](../../src/README.md) for source responsibilities.

| Location | Responsibility |
| --- | --- |
| `src/theme`, `src/pages` | Docusaurus integration and page entry points |
| `src/app` | Shared React layouts, navigation, providers, and behavior |
| `src/app/routes.js` | Shared URL values and comparisons; Docusaurus owns routing |
| `src/config` | Node configuration and build plugins |
| `src/app/styles` | Global defaults, tokens, and component SCSS Modules |
| `documents` | Publishable site content |

Reuse the shared layout and navigation. Keep global defaults in `styles/globals.css`, tokens in `styles/tokens`,
component styles in `styles/components`, and MDX home styles in `styles/pages` under `src/app`.
Use the existing breakpoints. VS Code settings use the repository's Prettier and ESLint configuration.

## Documents and pages

The content root is `documents`, configured in [document-instances.js](../../src/config/document-instances.js).
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

For a React page, add its entry point to `src/pages` and its implementation to `src/app/components`.
For example, `src/pages/about.jsx` creates `/about`; adding a URL constant alone does not create a page.
Keep private documents, credentials, build output, and other repositories' Git history out of this template.

English source documents live in `documents/`. Docusaurus uses locales `en`, `ko`, and `ja`:

```text
documents/
├── home.mdx
├── license.mdx
├── standard/
└── _translations/
    ├── ko/
    │   ├── code.json
    │   ├── docusaurus-theme-classic/navbar.json
    │   └── docusaurus-plugin-content-docs/current/
    └── ja/
        ├── code.json
        ├── docusaurus-theme-classic/navbar.json
        └── docusaurus-plugin-content-docs/current/
```

Keep translated file names, slugs, and explicit heading IDs aligned with the English originals. `_translations` is excluded from the English document tree.
Store custom React messages in `code.json` and navbar labels in `docusaurus-theme-classic/navbar.json`.
The language selector uses Docusaurus locale URLs, preserving the current document, query, and fragment.
Repository guide folders `language/eng`, `language/ko`, and `language/jp` are separate from site locales.
The navbar and home heading share the logo paths in `src/config/site.js`; the home version comes from `package.json`.

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

To enable Recent Updates, rename `src/pages/_updates.jsx` to `src/pages/updates.jsx` and add
`{type: 'custom-recentUpdates', position: 'right'}` to `navbar.items` in `src/config/site.js`.
The existing screen reuses the shared layout, filters, and date lists.

Agentation loads only in development through `src/app/DevTools.jsx`. To connect its local server:

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
CONTRIBUTING covers development, checks, commits, and publishing; source architecture belongs in [src/README](../../src/README.md).

Keep English, Korean, and Japanese guides equivalent, including commands and version badges.
The root English guides and `language/eng/` contain the same content with adjusted relative links.
Use centered language badges that link to the same document type, with the current language highlighted.
Check headings, tables, badges, code blocks, the contents list, and relative links in Markdown preview.
Use a `<picture>` logo with dark and light SVG sources at the top of each README.
Keep README and CONTRIBUTING at the root and in `language/`. Shared writing standards belong in `documents/standard/` and are published on the site; do not create a separate `docs/` directory.

## Compatibility

Docusaurus 3.10.1 needs [generated-module-compat.js](../../src/config/plugins/generated-module-compat.js)
for this repository's ESM setup. It adjusts mixed module handling only in generated JavaScript and uses `.cjs` for temporary server-rendering chunks.
See [the upstream discussion](https://github.com/facebook/docusaurus/discussions/11326).
After upgrading, consider removing it only when development, builds, and generated HTML content work without it.
Keep custom plugins in `src/config/plugins`; do not introduce dependency patches or separate local packages for this workaround.

## Contribution workflow

Use [GitHub Issues](https://github.com/4BFC/docnest/issues) for questions, reproducible bugs, and proposals.
Keep each change focused on the agreed problem, preserve unrelated work, and include the relevant checks and UI screenshots in a pull request.
Review the diff before committing. When working with an AI agent, staging and commits require an explicit user instruction;
commit messages must not include `Co-Authored-By`. Publishing and pushing are separate actions.

Keep `.env` files, local Claude/Codex settings, and AI instruction files on your machine; `.gitignore` excludes them.
Shared development guidance belongs in this guide and `src/README.md`.

## Publishing

Set the real public URL in `src/config/site.js` before publishing. Static hosts use `pnpm build` and the `build` output directory.
The default `baseUrl` is `/`. For a subpath, align `baseUrl`, manifest `start_url`, `scope`, icon paths,
and `pwaHead` links, then verify the build at that path.

Customize branding in `public/img`, `public/favicon.ico`, `public/apple-touch-icon.png`, and `public/manifest.json` as applicable.
Do not commit hosting credentials or personal account settings. A repository created from the template does not automatically receive upstream changes.

## License

Preserve the [MIT license](../../LICENSE), copyright notice, and third-party notices.
The bundled Pretendard license is in [public/fonts/pretendard/LICENSE](../../public/fonts/pretendard/LICENSE).
