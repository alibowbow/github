# OpenDesign 아카이브 추가

확인 날짜: 2026-10-19 (UTC)
대상: alibowbow/github
아카이브 기준 커밋: f94b056601fb1e0c973a82b287d1edd89e5ae4b1

## 공식 출처

- 사용자가 제공한 사이트: https://open-design.ai/ko/
- 위 사이트의 GitHub 버튼이 연결한 저장소: https://github.com/nexu-io/open-design
- 공개 상태: public, archived=false. GitHub API 메타데이터 확인 시각: 2026-10-19T21:59:48Z
- 원본 기준 커밋: 4f69a426689bbd471c8f0774c13378e651ae7de8
- README: https://github.com/nexu-io/open-design/blob/4f69a426689bbd471c8f0774c13378e651ae7de8/README.md
- README blob SHA: bf8b42df35f25e6aa865928233d9bfe152b9ea04
- LICENSE: https://github.com/nexu-io/open-design/blob/4f69a426689bbd471c8f0774c13378e651ae7de8/LICENSE
- LICENSE blob SHA: eb79c35bd865477e525b18e56f35d56fbe0f7110
- PRIVACY: https://github.com/nexu-io/open-design/blob/4f69a426689bbd471c8f0774c13378e651ae7de8/PRIVACY.md
- PRIVACY blob SHA: 5a179e65cfc5e964a1a7cd3e051baa75d65daa50
- API: https://api.github.com/repos/nexu-io/open-design

## 확인한 내용과 주의점

디자인 시스템과 코딩 에이전트를 결합하는 로컬 우선 디자인 워크스페이스다. README는 프로토타입·대시보드·슬라이드·이미지 및 HyperFrames 영상 제작, Claude Code·Codex·Cursor 등의 CLI/MCP 연결, BYOK와 OpenDesign Cloud를 소개한다. HTML·PDF·PPTX 등을 내보내며 HyperFrames는 MP4를 생성한다. PPTX의 완전한 네이티브 편집성을 보장한다고 정리하지 않았다.

macOS·Windows 데스크톱 배포를 제공하며 Linux는 소스 실행 안내다. 로컬 에이전트/BYOK 이용 시에도 에이전트 구독료·모델 API 요금은 별도로 발생할 수 있다. 댓글 기반 정밀 수정 등은 README 로드맵에서 부분 구현으로, 일부 tweaks UX·마이그레이션 플러그인은 미구현/alpha로 구분한다. 데모·제품 소개를 모든 기능의 완성 보증으로 해석하지 않았다.

실제 LICENSE는 Apache License 2.0이며 Copyright 2026 Open Design contributors를 명시한다. 별도 LICENSE가 있는 번들 스킬·템플릿에는 각 조건이 적용된다.

로컬 우선은 외부 전송 없음과 다르다. 선택한 모델 제공업체나 Cloud로 요청이 전송된다. PRIVACY.md는 제품 분석·품질 추적을 기본 활성화하고 선택적으로 끌 수 있다고 설명한다. 대화/도구 콘텐츠 공유가 켜지면 프롬프트·응답·도구 입출력 등의 일부가 마스킹·잘라내기 후 전송될 수 있다. 텔레메트리 목적지가 설정된 빌드의 안전·신뢰성 진단은 항상 활성이다. README의 짧은 privacy 설명보다 구체적인 PRIVACY.md를 함께 확인했다.

## 등록 범위

기존 추천 컬렉션의 `AI · 에이전트`에 `nexu-io/open-design`을 한 번 추가했다. `starred_at`은 null이며 사용자가 실제 GitHub에서 star했다고 주장하지 않는다. main 및 나머지 9개 기존 브랜치의 curation, 관련 PR 검색에서 중복을 찾지 못했다.

기존 16개 항목, 13개 Stars, Stars 수집 시각과 빈 마지막 페이지 기록을 그대로 유지했다. 새 항목을 curation·JSON·오프라인 JS 번들에 함께 기록하고 README·개수 검사와 신규 회귀 검사를 갱신했다. 다른 대기 브랜치의 항목을 이번 브랜치에 합치지 않았다. UI·스타일·데이터 스키마는 변경하지 않았다. OpenDesign 코드는 설치하거나 실행하지 않았다.

## 검사

- 원격에서 읽은 기준 파일 20개의 Git blob SHA 대조: 모두 일치
- `node --test tests/core.test.cjs`: 27개 통과
- 신규 항목 중복·필터·출처 고정·Apache-2.0·비용/텔레메트리 주의사항 및 curation 일치 검사: 통과
- JSON/JS 동등성·스키마 검사 및 기존 16개 항목·수집 기록 보존 검사: 통과
- JavaScript 구문 검사·변경 파일 공백 검사: 통과
- 전체 `npm test`와 linkedom DOM 실행: 미실행. 테스트 의존성 설치가 환경 정책으로 차단되어 추가 설치 없이 의존성 없는 검사를 수행했다. DOM 검사 코드는 새 항목과 개수에 맞게 갱신했으며 구문만 검사했다.
- 실제 브라우저 레이아웃·포커스 검증: 미실행. 이번 변경은 데이터·문서·검사에 한정한다.

작업은 별도 브랜치에 기록하며 main 병합·배포·공개 PR 생성은 수행하지 않는다.

