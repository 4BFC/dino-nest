# Docnest の開発と貢献

<div align="center">
<table align="center">
  <tr>
    <td align="center"><a href="../eng/CONTRIBUTING.md"><img src="https://img.shields.io/badge/English-555555?style=flat-square" alt="English"></a></td>
    <td align="center"><a href="../ko/CONTRIBUTING.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-555555?style=flat-square" alt="한국어"></a></td>
    <td align="center"><a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-0969DA?style=flat-square" alt="日本語"></a></td>
  </tr>
</table>
</div>

開発、チェック、公開の手順を説明します。製品の紹介と日常的な使い方は [README](./README.md) をご覧ください。
以下のコマンドはすべてリポジトリのルートで実行します。

## 目次

- [開発環境](#開発環境)
- [ソースの役割](#ソースの役割)
- [文書とページ](#文書とページ)
- [オプション機能](#オプション機能)
- [チェック](#チェック)
- [ドキュメントの作成](#ドキュメントの作成)
- [互換性](#互換性)
- [貢献の手順](#貢献の手順)
- [公開](#公開)
- [ライセンス](#ライセンス)

## 開発環境

[package.json](../../package.json) に指定された Node.js 24 (`>=24.22.1 <25`) と pnpm 10.5.2 を使用します。
nvm を使う場合は、リポジトリの [.nvmrc](../../.nvmrc) で Node.js 24 を選択します。

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm start
```

nvm を使わない場合は、対応するバージョンの Node.js を先に用意してください。必要に応じて [pnpm のインストールガイド](https://pnpm.io/installation)をご覧ください。
開発サーバーは通常 `http://localhost:3000` で開きます。このポートが使用中の場合は、次のように起動します。

```bash
pnpm start --port 3100 --no-open
```

依存パッケージは目的を明確にして変更し、lockfile も更新してください。

## ソースの役割

ソースの責務は [src/README](../../src/README.md) に従います。

| 場所 | 役割 |
| --- | --- |
| `src/theme`, `src/pages` | Docusaurus との接続とページのエントリーポイント |
| `src/app` | 共通の React レイアウト、ナビゲーション、Provider、動作 |
| `src/app/routes.js` | 共通の URL 値と比較。実際のルーティングは Docusaurus が担当 |
| `src/config` | Node の設定とビルドプラグイン |
| `src/app/styles` | グローバル設定、トークン、コンポーネントの SCSS Modules |
| `documents` | 公開するサイトのコンテンツ |

共通のレイアウトとナビゲーションを再利用します。`src/app` の下で、グローバル設定は `styles/globals.css`、
トークンは `styles/tokens`、コンポーネントのスタイルは `styles/components`、MDX ホームのスタイルは `styles/pages` に分けます。
既存のブレークポイントを使ってください。VS Code の設定はリポジトリの Prettier と ESLint 設定を使用します。

## 文書とページ

コンテンツのルートは `documents` で、[document-instances.js](../../src/config/document-instances.js) に登録されています。
初期ページは `/`、`/license`、`/standard/readme-style-standard` です。Markdown または MDX に、次のようなメタデータを記述します。

```md
---
title: 最初のノート
description: このページの短い説明。
slug: /notes/first-note
sidebar_position: 1
created_at: 2026-11-09
updated_at: 2026-11-09
---

ここに本文を書きます。
```

文書間のリンクには拡張子を含む相対パスを使います。`_category_.json` の `position` と `label` でフォルダーの順序と名前を設定し、
フォルダーの `index.mdx` を文書一覧の入り口にできます。日付は Git 履歴ではなく frontmatter から取得します。

React ページのエントリーポイントは `src/pages`、実装は `src/app/components` に置きます。
例えば `src/pages/about.jsx` は `/about` を作成します。URL 定数を追加するだけではページは作成されません。
個人文書、認証情報、ビルド結果、別リポジトリの Git 履歴はテンプレートに含めないでください。

英語の原文は `documents/` に置きます。Docusaurus のロケールは `en`、`ko`、`ja` です。
韓国語と日本語の文書は `documents/_translations/<locale>/docusaurus-plugin-content-docs/current/` に置き、英語の原文とファイル名、slug、明示的な見出し ID をそろえます。
`_translations` は英語の文書ツリーから除外されます。各言語フォルダの `code.json` に React のメッセージ、
`docusaurus-theme-classic/navbar.json` にナビゲーションの翻訳を記載します。
言語選択は Docusaurus のロケール URL を使い、現在の文書、クエリ、フラグメントを保持します。
リポジトリのガイド用フォルダ `language/eng`、`language/ko`、`language/jp` とサイトのロケールを区別してください。
上部とホームのロゴは `src/config/site.js` のロゴパスを共有し、ホームのバージョンは `package.json` から読み取ります。

開発サーバーは一度に一つの言語を提供します。

```bash
pnpm start --locale ko --port 3100 --no-open
```

3言語間の切り替えは全体のビルドで確認します。

```bash
pnpm build
pnpm serve --host 127.0.0.1 --port 4173 --no-open
```

プレビューサーバーの `/`、`/ko/`、`/ja/` を確認します。翻訳文書の残りのパスは原文と同じです。

## オプション機能

Recent Updates を有効にするには、`src/pages/_updates.jsx` を `src/pages/updates.jsx` に変更し、
`src/config/site.js` の `navbar.items` に `{type: 'custom-recentUpdates', position: 'right'}` を追加します。
既存の画面は共通のレイアウト、フィルター、日付別一覧を再利用します。

Agentation は開発環境でのみ `src/app/DevTools.jsx` から読み込まれます。ローカルサーバーを接続するには、次を実行します。

```bash
pnpm agentation
```

別のターミナルで `pnpm agentation:doctor` を実行して確認します。既定の endpoint は `http://localhost:4747` です。
サーバー、ブラウザー同期、MCP 接続をそれぞれ確認し、フィードバックの元の対象と修正結果を確認してから解決済みにします。

## チェック

```bash
pnpm format:check
pnpm build
pnpm serve --port 4173
```

`pnpm build` は ESLint と Stylelint を実行してから、リンクと静的サイトの生成を確認します。
lint だけを実行するには `pnpm lint` を使います。意図した整形や自動修正には
`pnpm format`、`pnpm lint:js:fix`、`pnpm lint:css:fix` を使い、差分を確認してください。専用のテストスイートや CI は含まれていません。

開発時の生成物には `.docusaurus-dev`、本番ビルドには `.docusaurus` を使います。静的プレビューは開発サーバーと異なるポートで起動します。
検索と PWA の動作は本番ビルドのプレビューで確認してください。古いサービスワーカーが影響する場合は、その URL の登録とキャッシュを確認します。
UI を変更したら、デスクトップとモバイル、両方のテーマ、ナビゲーションの開閉、再読み込みを確認します。
生成されたホームとライセンスの HTML に、空の枠だけでなく実際の本文が含まれていることも確認してください。

```bash
git diff --check
git diff --stat
git status --short
```

新しい未追跡ファイルは通常の `git diff` に含まれないため、別途内容を確認します。

## ドキュメントの作成

[README style standard](../../documents/standard/readme-style-standard.md) に従います。
README は製品、簡潔な仕様、インストール、使い方を説明するユーザーマニュアルです。
CONTRIBUTING には開発、チェック、コミット、公開の手順を記載し、ソース構造は [src/README](../../src/README.md) で管理します。

英語、韓国語、日本語のガイドは、コマンドやバージョンバッジも含めて同じ内容に保ちます。
ルートの英語ガイドと `language/eng/` は、相対リンクを調整した同じ本文で管理します。
各文書の上部に、同じ種類の文書にリンクする中央揃えの言語バッジを置き、現在の言語を強調します。
Markdown プレビューで見出し、表、バッジ、コードブロック、目次、相対リンクを確認してください。
README と CONTRIBUTING はルートと `language/` で管理します。共通の作成基準は `documents/standard/` に置いてサイトで公開し、別の `docs/` ディレクトリは作成しません。

各 README の上部に `<picture>` を使い、ライトとダークの SVG ロゴを指定します。

## 互換性

現在の ESM 構成では、Docusaurus 3.10.1 に [generated-module-compat.js](../../src/config/plugins/generated-module-compat.js) が必要です。
生成された JavaScript 内の混在するモジュールの解釈だけを調整し、サーバーレンダリング用の一時チャンクを `.cjs` で出力します。
背景については[公式の議論](https://github.com/facebook/docusaurus/discussions/11326)をご覧ください。
アップグレード後、プラグインなしで開発、ビルド、生成 HTML の本文が正常に動作することを確認してから、削除を検討します。
独自プラグインは `src/config/plugins` で管理し、この対応のために依存パッケージへのパッチや別のローカルパッケージを追加しないでください。

## 貢献の手順

質問、再現可能な不具合、改善提案には [GitHub Issues](https://github.com/4BFC/docnest/issues) を利用してください。
合意した問題の範囲に集中し、無関係な変更は保持します。Pull Request には変更理由、チェック結果、必要な画面を添付します。
コミット前に差分を確認してください。AI と作業する場合、ステージングとコミットにはユーザーの明示的な指示が必要です。
コミットメッセージに `Co-Authored-By` を追加しません。push と公開も別の操作として扱います。

`.env` ファイル、ローカルの Claude/Codex 設定、AI 指示ファイルは手元の環境だけに保存します。`.gitignore` でこれらを除外します。
共有する開発ガイドは、この文書と `src/README.md` に記載します。

## 公開

公開前に `src/config/site.js` の URL を実際の公開 URL に変更します。静的ホスティングではビルドコマンドを `pnpm build`、出力先を `build` に設定します。
既定の `baseUrl` は `/` です。サブパスに公開する場合は、`baseUrl`、manifest の `start_url`、`scope`、アイコンのパス、
`pwaHead` のリンクをそろえ、そのパスでビルド結果を確認してください。

必要に応じて `public/img`、`public/favicon.ico`、`public/apple-touch-icon.png`、`public/manifest.json` のロゴやアプリ情報を変更します。
ホスティングの認証情報や個人アカウント設定はコミットしないでください。テンプレートから作成したリポジトリには、元の変更は自動で反映されません。

## ライセンス

[MIT ライセンス](../../LICENSE)の著作権表示と許諾文、およびサードパーティーのライセンス表示を保持してください。
同梱の Pretendard フォントのライセンスは [public/fonts/pretendard/LICENSE](../../public/fonts/pretendard/LICENSE) にあります。
