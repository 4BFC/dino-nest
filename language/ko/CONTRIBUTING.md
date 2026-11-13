# dino-nest 개발과 기여

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
- [사이트 구조](#사이트-구조)
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

## 사이트 구조

공통 레이아웃, 탐색, 스타일, 글꼴, 기본 UI 번역과 빌드 플러그인은 [Dino Ovum](https://github.com/4BFC/dino-ovum) 패키지가 제공합니다.
이 저장소에는 사용자가 커스텀하는 파일만 둡니다.

| 위치 | 책임 |
| --- | --- |
| `docusaurus.config.js` | 사이트 이름, URL, 로고, 언어와 Dino Ovum 옵션 |
| `documents` | 공개할 사이트 콘텐츠와 번역 |
| `public` | 로고, 아이콘과 그 밖의 정적 파일 |
| `src` | 사용자 스타일과 공통 컴포넌트 래퍼. [`src` 폴더](#src-폴더) 참고 |

```text
docusaurus.config.js
  → createDinoConfig(사이트 설정, Dino Ovum 옵션)
      → @dino-ovum/preset: 문서, 사이드바, 검색, PWA, 탐색, 최근 업데이트
          → @dino-ovum/theme: 레이아웃, 탐색, 스타일, 글꼴, 기본 UI 번역
  → src/theme의 파일이 공통 테마보다 우선
```

`createDinoConfig`의 첫 인자는 Docusaurus 사이트 설정입니다. 객체는 공통 기본값과 합쳐지고,
`navbar.items` 같은 배열은 기본값을 교체합니다. 두 번째 인자로 `documents`, `customCss`, `search`, `pwa`, `updates`를 선택합니다.
옵션별 설명은 [Dino Ovum 설정 안내](https://github.com/4BFC/dino-ovum/blob/main/docs/configuration.md)를 참고하세요.

### `src` 폴더

`src`의 각 위치는 역할이 하나씩 정해져 있고, 시작점이 되는 파일이 들어 있습니다. 예시는 사이트에 맞게 고쳐 씁니다.

| 위치 | 역할 | 들어 있는 파일 |
| --- | --- | --- |
| `src/globals.scss` | 공통 테마 뒤에 적용하는 전역 스타일 | 주석 처리된 색상, 글꼴, 레이아웃 예시 |
| `src/styles` | import한 곳에만 적용되는 module 스타일(`*.module.scss`) | `custom.module.scss`: `.note` 클래스 |
| `src/theme` | 공통 컴포넌트의 래퍼나 교체 파일 | `Root.jsx`: Agentation을 로드 |

```text
src/globals.scss → docusaurus.config.js의 customCss → 모든 페이지
src/styles/custom.module.scss → import한 MDX나 src/theme 파일에만 적용
```

`src/theme`는 Docusaurus가 동작을 정해 둔 폴더입니다. 이 폴더의 파일은 같은 경로의 공통 컴포넌트를 대신합니다.

공통 컴포넌트를 확장하려면 `src/theme`의 같은 경로에 파일을 만들고 원본을 감쌉니다.

```jsx
// src/theme/DinoOvum/HomeHeading.jsx
import OriginalHomeHeading from '@theme-original/DinoOvum/HomeHeading';

export default function HomeHeading() {
  return (
    <>
      <OriginalHomeHeading />
      <p>이 사이트의 안내 문구</p>
    </>
  );
}
```

래퍼는 이후 패키지 개선을 계속 받지만, 완전히 교체한 파일은 받지 못합니다. MDX와 페이지는 `@theme/DinoOvum/`에서
`HomeHeading`, `DocumentTable`, `LibraryLayout`, `Updates`, `UpdatesPage`를 가져옵니다.
VS Code 설정은 저장소의 Prettier와 ESLint 설정을 사용합니다.

## 문서와 페이지

콘텐츠 루트는 Dino Ovum 기본값인 `documents`입니다. 다른 디렉터리를 쓰려면 `createDinoConfig`의 두 번째 인자에
`documents.path`를 지정합니다. 번역 디렉터리도 그 아래로 함께 옮겨집니다.
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

React 페이지는 `src/pages`에 파일을 추가합니다. 예를 들어 `src/pages/about.jsx`가 `/about`을 만듭니다.
문서와 같은 레이아웃을 쓰려면 `@theme/Layout`과 `@theme/DinoOvum/LibraryLayout`으로 감쌉니다.
개인 문서, 인증 정보, 빌드 결과와 다른 저장소의 Git 이력은 템플릿에 넣지 않습니다.

영어 원문은 `documents/`에 작성합니다. Docusaurus 언어 코드는 `en`, `ko`, `ja`입니다.
한국어와 일본어 번역문은 `documents/_translations/<locale>/docusaurus-plugin-content-docs/current/`에 두고 영어 원문과 파일명, slug, 명시적인 제목 ID를 맞춥니다.
`_translations`는 영어 문서 트리에서 제외됩니다. 각 언어 폴더의 `docusaurus-theme-classic/navbar.json`에는 상단 메뉴 번역을 둡니다.
한국어와 일본어 UI 메시지는 `@dino-ovum/theme`이 제공합니다. 바꾸고 싶은 메시지는 해당 언어의 `code.json`에 같은 키로 추가하면 우선 적용됩니다.
언어 선택은 Docusaurus의 언어별 URL을 사용하며 현재 문서, 쿼리와 해시를 유지합니다.
저장소 안내서의 `language/eng`, `language/ko`, `language/jp`와 사이트 언어를 구분합니다.
상단과 홈 로고는 `docusaurus.config.js`의 로고 경로를 공유하고, 홈 버전은 `package.json`에서 읽습니다.

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

Recent Updates를 사용하려면 `docusaurus.config.js`에서 `createDinoConfig`의 두 번째 인자에 `updates: true`를 지정합니다.
`/updates` 페이지와 상단 바로가기가 공통 레이아웃, 필터와 날짜별 목록으로 추가됩니다.
`navbar.items`를 직접 지정했다면 `{type: 'custom-recentUpdates', position: 'right'}`도 포함합니다.

Agentation은 개발 중에 AI 에이전트와 함께 화면을 검토할 수 있도록 템플릿에 포함되어 있습니다.
`src/theme/Root.jsx`에서 개발 서버에만 로드하며, Dino Ovum 패키지에는 포함되지 않습니다. 로컬 서버를 연결하려면 실행합니다.

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
CONTRIBUTING에는 개발, 사이트 구조, 검사, 커밋과 배포 절차를 둡니다.
Dino Ovum 패키지 내부 구조는 [Dino Ovum 저장소](https://github.com/4BFC/dino-ovum)에서 관리합니다.

영어, 한국어, 일본어 문서는 명령과 버전 배지를 포함해 같은 내용을 유지합니다.
루트 영어 문서와 `language/eng/`는 상대경로를 조정한 동일 본문으로 관리합니다.
상단에 같은 종류의 문서로 연결하는 가운데 정렬 언어 배지를 두고 현재 언어를 강조합니다.
Markdown 미리보기에서 제목, 표, 배지, 코드 블록, 목차와 상대 링크를 확인합니다.
README와 CONTRIBUTING은 루트와 `language/`에서 관리합니다. 공통 작성 기준은 `documents/standard/`에 두고 사이트에 공개하며, 별도의 `docs/` 디렉터리는 만들지 않습니다.

README 상단의 `<picture>` 로고에는 라이트와 다크 SVG를 연결합니다.

## 호환성

`@dino-ovum/preset` 0.1.0은 Docusaurus 3.10.1, React 19, Node.js `>=24.22.1 <25`를 지원합니다.
Docusaurus 빌드 호환 플러그인은 preset에 포함되어 있으므로 이 저장소에서 따로 관리하지 않습니다.
`@docusaurus/core`는 해당 버전을 지원하는 preset 버전과 함께 올립니다.
`package.json`의 `browserslist`를 유지합니다. 없으면 Babel이 오래된 브라우저용으로 변환하면서 Mermaid의 선택 import 때문에 빌드가 실패할 수 있습니다.
설치된 패키지는 패치하지 않습니다. 공통 문제는 [Dino Ovum Issues](https://github.com/4BFC/dino-ovum/issues)에 남깁니다.

## 기여 절차

질문, 재현 가능한 버그와 개선 제안은 [GitHub Issues](https://github.com/4BFC/dino-nest/issues)를 이용합니다.
합의한 문제 범위에 집중하고 관련 없는 변경을 보존합니다. Pull Request에는 변경 이유, 검사 결과와 필요한 화면을 첨부합니다.
커밋 전 diff를 검토합니다. AI와 작업할 때는 사용자의 명시적 지시가 있어야 스테이징과 커밋을 진행하며,
커밋 메시지에 `Co-Authored-By`를 넣지 않습니다. push와 게시도 별도 작업으로 구분합니다.

`.env` 파일, 로컬 Claude/Codex 설정과 AI 지침 파일은 개인 환경에만 보관합니다. `.gitignore`에서 이 파일들을 제외합니다.
공유할 개발 지침은 이 가이드에 작성합니다.

## 배포

배포 전 `docusaurus.config.js`의 공개 URL을 실제 주소로 바꿉니다. 정적 호스팅에는 빌드 명령 `pnpm build`, 출력 디렉터리 `build`를 사용합니다.
기본 `baseUrl`은 `/`입니다. 하위 경로에 배포한다면 `baseUrl`을 바꿉니다. PWA manifest와 아이콘 경로, `pwaHead` 링크가 이를 따릅니다.
해당 경로에서 빌드를 확인합니다.

필요에 따라 `public/img`, `public/favicon.ico`, `public/apple-touch-icon.png`와 `docusaurus.config.js`의 `pwa` 옵션에서 로고와 앱 정보를 변경합니다.
호스팅 인증 정보와 개인 계정 설정은 커밋하지 않습니다.
공통 디자인과 기능 개선은 `@dino-ovum/preset`과 lockfile을 갱신한 뒤 다시 빌드·배포해 받습니다.
README, CONTRIBUTING, 설정 파일처럼 템플릿 자체 파일의 변경은 자동으로 반영되지 않습니다.

## 라이선스

[MIT 라이선스](../../LICENSE)의 저작권 고지와 허가문, 외부 라이선스 고지를 유지합니다.
Pretendard 글꼴과 [해당 라이선스](https://github.com/4BFC/dino-ovum/blob/main/packages/theme/src/assets/fonts/pretendard/LICENSE)는 `@dino-ovum/theme`에 포함되어 있습니다.
