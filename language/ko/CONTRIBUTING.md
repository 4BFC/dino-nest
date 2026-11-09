# Docnest 개발과 기여

<div align="center">
<table align="center">
  <tr>
    <td align="center"><a href="../eng/CONTRIBUTING.md"><img src="https://img.shields.io/badge/English-555555?style=flat-square" alt="English"></a></td>
    <td align="center"><a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-0969DA?style=flat-square" alt="한국어"></a></td>
    <td align="center"><a href="../jp/CONTRIBUTING.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-555555?style=flat-square" alt="日本語"></a></td>
  </tr>
</table>
</div>

개발, 검사와 배포 절차를 안내합니다. 제품 소개와 일상적인 사용법은 [README](./README.md)를 참고하세요.
아래 명령은 모두 저장소 루트에서 실행합니다.

## 목차

- [개발 환경](#개발-환경)
- [소스 책임](#소스-책임)
- [문서와 페이지](#문서와-페이지)
- [선택 기능](#선택-기능)
- [검사](#검사)
- [문서 작성](#문서-작성)
- [호환성](#호환성)
- [기여 절차](#기여-절차)
- [배포](#배포)
- [라이선스](#라이선스)

## 개발 환경

[package.json](../../package.json)에 명시한 Node.js 24 (`>=24.22.1 <25`)와 pnpm 10.5.2를 사용합니다.
nvm을 사용한다면 저장소의 [.nvmrc](../../.nvmrc)로 Node.js 24를 선택합니다.

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm start
```

nvm을 사용하지 않는다면 지원 범위에 맞는 Node.js를 먼저 준비하세요. 필요하면 [pnpm 설치 안내](https://pnpm.io/installation)를 참고합니다.
개발 서버는 보통 `http://localhost:3000`에서 열립니다. 해당 포트를 사용 중이라면 다음처럼 실행합니다.

```bash
pnpm start --port 3100 --no-open
```

의존성은 변경 목적이 있을 때만 수정하고 lockfile도 함께 갱신합니다.

## 소스 책임

[src/README](../../src/README.md)의 소스 책임 구분을 따릅니다.

| 위치 | 책임 |
| --- | --- |
| `src/theme`, `src/pages` | Docusaurus 연결과 페이지 진입점 |
| `src/app` | 공통 React 레이아웃, 탐색, Provider와 동작 |
| `src/app/routes.js` | 공통 URL 값과 비교, 실제 라우팅은 Docusaurus가 담당 |
| `src/config` | Node 설정과 빌드 플러그인 |
| `src/app/styles` | 전역 기본값, 토큰과 컴포넌트 SCSS Modules |
| `documents` | 공개할 사이트 콘텐츠 |

공통 레이아웃과 탐색을 재사용합니다. `src/app` 아래에서 전역 기본값은 `styles/globals.css`,
토큰은 `styles/tokens`, 컴포넌트 스타일은 `styles/components`, MDX 홈 스타일은 `styles/pages`로 구분합니다.
기존 breakpoint를 재사용합니다. VS Code 설정은 저장소의 Prettier와 ESLint 설정을 사용합니다.

## 문서와 페이지

콘텐츠 루트는 `documents`이며 [document-instances.js](../../src/config/document-instances.js)에서 등록합니다.
기본 페이지는 `/`, `/license`, `/standard/readme-style-standard`입니다. Markdown이나 MDX에 다음과 같이 메타데이터를 작성합니다.

```md
---
title: 첫 번째 기록
description: 이 페이지의 내용을 짧게 설명합니다.
slug: /notes/first-note
sidebar_position: 1
created_at: 2026-11-09
updated_at: 2026-11-09
---

본문을 작성합니다.
```

문서 링크에는 확장자가 포함된 상대경로를 사용합니다. `_category_.json`의 `position`, `label`로 폴더 순서와 이름을 정하고,
폴더의 `index.mdx`를 문서 목록 진입점으로 사용할 수 있습니다. 날짜는 Git 이력이 아닌 frontmatter에서 읽습니다.

React 페이지의 진입점은 `src/pages`, 구현은 `src/app/components`에 둡니다.
예를 들어 `src/pages/about.jsx`가 `/about`을 만듭니다. URL 상수만 추가하면 페이지가 생기지 않습니다.
개인 문서, 인증 정보, 빌드 결과와 다른 저장소의 Git 이력은 템플릿에 넣지 않습니다.

영어 원문은 `documents/`에 작성합니다. Docusaurus 언어 코드는 `en`, `ko`, `ja`입니다.
한국어와 일본어 번역문은 `documents/_translations/<locale>/docusaurus-plugin-content-docs/current/`에 두고 영어 원문과 파일명, slug, 명시적인 제목 ID를 맞춥니다.
`_translations`는 영어 문서 트리에서 제외됩니다. 각 언어 폴더의 `code.json`에는 React 메시지,
`docusaurus-theme-classic/navbar.json`에는 상단 메뉴 번역을 둡니다.
언어 선택은 Docusaurus의 언어별 URL을 사용하며 현재 문서, 쿼리와 해시를 유지합니다.
저장소 안내서의 `language/eng`, `language/ko`, `language/jp`와 사이트 언어를 구분합니다.
상단과 홈 로고는 `src/config/site.js`의 로고 경로를 공유하고, 홈 버전은 `package.json`에서 읽습니다.

개발 서버는 한 번에 한 언어만 제공합니다.

```bash
pnpm start --locale ko --port 3100 --no-open
```

세 언어 사이의 전환은 전체 빌드로 확인합니다.

```bash
pnpm build
pnpm serve --host 127.0.0.1 --port 4173 --no-open
```

미리보기 서버의 `/`, `/ko/`, `/ja/`를 확인합니다. 번역 문서의 나머지 경로는 원문과 같습니다.

## 선택 기능

Recent Updates를 사용하려면 `src/pages/_updates.jsx`를 `src/pages/updates.jsx`로 바꾸고,
`src/config/site.js`의 `navbar.items`에 `{type: 'custom-recentUpdates', position: 'right'}`를 추가합니다.
기존 화면이 공통 레이아웃, 필터와 날짜별 목록을 재사용합니다.

Agentation은 `src/app/DevTools.jsx`에서 개발 환경에만 로드합니다. 로컬 서버를 연결하려면 실행합니다.

```bash
pnpm agentation
```

별도 터미널에서 `pnpm agentation:doctor`로 확인합니다. 기본 endpoint는 `http://localhost:4747`입니다.
서버, 브라우저 동기화와 MCP 연결을 각각 확인하고, 피드백의 원래 대상과 수정 결과를 확인한 뒤 해결 처리합니다.

## 검사

```bash
pnpm format:check
pnpm build
pnpm serve --port 4173
```

`pnpm build`는 ESLint와 Stylelint를 먼저 실행한 뒤 링크와 정적 사이트 생성을 확인합니다.
린트만 실행할 때는 `pnpm lint`를 사용합니다. 의도한 포맷 변경이나 자동 수정에는
`pnpm format`, `pnpm lint:js:fix`, `pnpm lint:css:fix`를 사용하고 diff를 확인합니다. 별도 테스트 체계와 CI는 포함하지 않습니다.

개발 생성물은 `.docusaurus-dev`, 배포 빌드 생성물은 `.docusaurus`를 사용합니다. 정적 미리보기는 개발 서버와 다른 포트를 사용합니다.
검색과 PWA는 배포 빌드의 미리보기에서 확인합니다. 기존 서비스 워커가 미리보기에 영향을 주면 해당 주소의 등록과 캐시를 확인합니다.
UI 변경은 데스크톱과 모바일, 두 색상 모드, 패널 펼침과 접힘, 새로고침을 확인합니다.
홈과 라이선스의 생성 HTML에 빈 틀만 있는 것이 아니라 실제 본문이 있는지도 확인합니다.

```bash
git diff --check
git diff --stat
git status --short
```

새 미추적 파일은 일반 `git diff`에 포함되지 않으므로 별도로 내용을 검토합니다.

## 문서 작성

[README style standard](../../documents/standard/readme-style-standard.md)를 따릅니다.
README는 제품 소개, 간단한 스펙, 설치와 사용법을 담는 사용 설명서입니다.
CONTRIBUTING에는 개발, 검사, 커밋과 배포 절차를 두고 소스 구조는 [src/README](../../src/README.md)에서 관리합니다.

영어, 한국어, 일본어 문서는 명령과 버전 배지를 포함해 같은 내용을 유지합니다.
루트 영어 문서와 `language/eng/`는 상대경로를 조정한 동일 본문으로 관리합니다.
상단에 같은 종류의 문서로 연결하는 가운데 정렬 언어 배지를 두고 현재 언어를 강조합니다.
Markdown 미리보기에서 제목, 표, 배지, 코드 블록, 목차와 상대 링크를 확인합니다.
README와 CONTRIBUTING은 루트와 `language/`에서 관리합니다. 공통 작성 기준은 `documents/standard/`에 두고 사이트에 공개하며, 별도의 `docs/` 디렉터리는 만들지 않습니다.

README 상단의 `<picture>` 로고에는 라이트와 다크 SVG를 연결합니다.

## 호환성

현재 ESM 구성에서는 Docusaurus 3.10.1에 [generated-module-compat.js](../../src/config/plugins/generated-module-compat.js)가 필요합니다.
생성 JavaScript 안의 혼합 모듈 해석만 조정하고, 서버 렌더링 임시 청크를 `.cjs`로 출력합니다.
근거는 [공식 논의](https://github.com/facebook/docusaurus/discussions/11326)를 참고하세요.
업그레이드 후 플러그인 없이 개발, 빌드와 생성 HTML 본문이 정상일 때 제거를 검토합니다.
자체 플러그인은 `src/config/plugins`에서 관리하며 이 예외를 위해 의존성 패치나 별도 로컬 패키지를 추가하지 않습니다.

## 기여 절차

질문, 재현 가능한 버그와 개선 제안은 [GitHub Issues](https://github.com/4BFC/docnest/issues)를 이용합니다.
합의한 문제 범위에 집중하고 관련 없는 변경을 보존합니다. Pull Request에는 변경 이유, 검사 결과와 필요한 화면을 첨부합니다.
커밋 전 diff를 검토합니다. AI와 작업할 때는 사용자의 명시적 지시가 있어야 스테이징과 커밋을 진행하며,
커밋 메시지에 `Co-Authored-By`를 넣지 않습니다. push와 게시도 별도 작업으로 구분합니다.

`.env` 파일, 로컬 Claude/Codex 설정과 AI 지침 파일은 개인 환경에만 보관합니다. `.gitignore`에서 이 파일들을 제외합니다.
공유할 개발 지침은 이 가이드와 `src/README.md`에 작성합니다.

## 배포

배포 전 `src/config/site.js`의 공개 URL을 실제 주소로 바꿉니다. 정적 호스팅에는 빌드 명령 `pnpm build`, 출력 디렉터리 `build`를 사용합니다.
기본 `baseUrl`은 `/`입니다. 하위 경로에 배포한다면 `baseUrl`, manifest의 `start_url`, `scope`, 아이콘 경로와
`pwaHead` 링크를 함께 맞춘 뒤 해당 경로에서 빌드를 확인합니다.

필요에 따라 `public/img`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/manifest.json`에서 로고와 앱 정보를 변경합니다.
호스팅 인증 정보와 개인 계정 설정은 커밋하지 않습니다. 템플릿으로 만든 저장소에 원본의 변경이 자동 반영되지는 않습니다.

## 라이선스

[MIT 라이선스](../../LICENSE)의 저작권 고지와 허가문, 외부 라이선스 고지를 유지합니다.
포함된 Pretendard 글꼴의 라이선스는 [public/fonts/pretendard/LICENSE](../../public/fonts/pretendard/LICENSE)에 있습니다.
