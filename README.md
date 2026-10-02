# Repository Atlas

공개 GitHub 저장소를 한국어로 이해하고, 나만의 메모와 태그로 다시 찾는 아카이브입니다. 대상 프로젝트는 **alibowbow/github**이며 GitHub 서비스 자체를 만드는 프로젝트가 아닙니다.

HTML / CSS / JavaScript만으로 실행됩니다. 앱에 빌드·런타임 의존성·로그인·OAuth·키·유료 서비스가 없습니다. Node.js와 Python은 테스트/스냅샷 수집용입니다.

## 실행

`index.html`을 브라우저에서 열면 동봉 데이터로 기본 탐색할 수 있습니다. 정적 웹서버에서는 다음처럼 실행할 수 있습니다.

```bash
python3 -m http.server 8765 --directory .
```

`http://localhost:8765/`에서 엽니다. 설치 없이 기본 탐색이 가능하며 브라우저가 `file://` 저장 또는 외부 요청을 제한하는 경우 로컬 HTTP 서버를 사용하세요. 첫 로드에 외부 글꼴/CDN/API를 요청하지 않습니다. 저장과 메모는 브라우저별·origin별 localStorage에 남으므로 파일 실행과 HTTP 실행의 저장 공간이 같다고 가정하지 마세요.

## 기능

- 전체 / 내 GitHub Stars / 기기 저장 / 별도 추천 컬렉션
- 한국어·영문 다중 검색: 이름, 작성자, 원문 설명, 정리한 용도, 사용 상황, 카테고리, 태그, 개인 태그, 메모
- 카테고리·언어·라이선스 필터, 별 수·이름·최근 **코드 푸시** 정렬, 초기화
- 공개 저장소 URL 또는 `owner/repo` 추가, 여러 줄·쉼표 일괄 입력, 대소문자·`.git`·끝 슬래시 정규화
- 공개 API 확인 후 적용 전 미리보기; 실패·미조회·중복·부분 결과를 구분
- Stars를 빈 페이지까지 재동기화; GitHub에 star/unstar를 쓰는 기능 없음
- 저장·메모·개인 태그 복원, 저장 해제 시 메모 유지
- 최대 3개 비교, JSON 내보내기/검증/가져오기 미리보기
- 라이트/다크 테마, 빈 결과·수집 중·실패 상태
- 상세 모달의 고정 닫기, native `<dialog>` Escape·포커스 격리, 닫은 뒤 호출 카드로 포커스 복귀
- `/` 또는 Ctrl/Cmd+K: 검색으로 이동
- 데스크톱 3열, 중간 화면 2열, 모바일 1열; 페이지당 최대 60개 카드

## 동봉 데이터와 원문 확인

공개 Stars 수집: **2026-10-01 23:34:56 UTC**, page 1 = **13개**, page 2 = **0개**. `Accept: application/vnd.github.star+json` 응답에서 실제 `starred_at`을 확보했습니다. 원문 README 검토: **2026-10-01 23:49:52 UTC**. 추천 **2개**: `BurntSushi/ripgrep`, `marimo-team/marimo`. 추천은 Stars와 별도이며 star 날짜를 만들지 않습니다.

API:

- https://api.github.com/users/alibowbow/starred?per_page=100&page=1
- https://api.github.com/users/alibowbow/starred?per_page=100&page=2

`data/snapshot.json`은 공개 메타데이터와 직접 작성한 한국어 정리만 포함합니다. `data/snapshot.js`는 파일을 직접 열 때도 fetch 없이 탐색하기 위한 같은 데이터의 브라우저 번들입니다. 테스트가 두 파일의 일치를 확인합니다. README 전문·모델 데이터·private 데이터·토큰을 복사하지 않았습니다.

각 항목은 공식 repo/README/문서 링크, API 확인 시각, 요약 원문 확인 시각, README blob SHA를 제공합니다. 수집 시 읽은 README의 Git blob 해시와 API SHA를 15개 모두 대조했습니다. 한국어 용도·사용 상황·확인 메모는 이 아카이브의 정리이며 원문 `description`과 별도로 표시됩니다. 원문 설명이 없는 `mobile-codex`, `ASI-Evolve`도 README에서 확인했습니다.

| 항목 | 표시 기준 |
|---|---|
| 코드 활동 | `pushed_at`; 메타데이터 갱신일로 대체하지 않음 |
| 메타데이터 갱신 | `updated_at`; 상세에서 별도 표시 |
| 내가 star한 시각 | 실제 `starred_at`; 없으면 미확인 |
| mobile-codex | 비공식 Android Codex 클라이언트; API GPL-3.0과 README의 GPL-3.0-only 구분 |
| ASI-Evolve | 지식→가설→실험→분석 루프; Researcher/Engineer/Analyzer와 메모리 구조 확인 |
| NOASSERTION | “별도 확인 필요”; 임의 SPDX 라이선스를 붙이지 않음 |
| NOASSERTION README 설명 | AngelSlim 사용자 정의 조건, music-composition의 문서 CC BY 4.0 / scripts MIT, awesome-gpt-image-2의 CC BY 4.0 언급을 확인 메모에 별도 표시 |
| 신규 API 항목 | 공개 메타데이터 확인과 한국어 요약/README 미검토 구분 |
| 외부 JSON의 새 항목 | API·README 미확인; GitHub Stars/공식 추천을 주장할 수 없음 |

디자인 참조: `alibowbow/ainew` main `1a371dfc73c3f65eb0b8ad577a0ed3ca18796b78`의 README.md, atlas.css, index.html 및 실제 Model Atlas 카탈로그 화면. 팔레트·정보 밀도·카드·검색·상세 보기만 참고했습니다.

## 확장·동기화·보존

13개는 초기 스냅샷의 크기이며 코드에는 13개 전용 데이터 구조가 없습니다. 공개 Stars는 최대 100개씩 요청하며 **빈 마지막 페이지**를 확인해야 성공으로 적용합니다. 페이지 중복·private/잘못된 응답·타임아웃·API 제한이 발생하면 전체 재동기화를 취소하고 이전 성공 목록과 날짜를 유지합니다. 임시 수집 개수와 완료하지 못한 상태를 표시합니다. 처음부터 일부 성공 페이지를 전체 Stars인 것처럼 표시하지 않습니다.

URL 일괄 추가는 한 번에 최대 500개이며 순차 요청합니다. 기존 아카이브 항목은 API를 다시 호출하지 않습니다. API 제한/네트워크 오류가 발생하면 나머지는 미조회로 표시하고 성공 항목만 선택 적용할 수 있습니다. 적용 전에는 기존 데이터를 바꾸지 않습니다. 공개 API 메타데이터 수집과 한국어 요약 검토는 서로 다른 단계입니다.

JSON은 최대 10MB / 10,000개입니다. 형식·필드·텍스트 길이·태그·숫자·UTC 날짜·저장소/문서 URL을 검사하며 잘못된 전체 JSON은 적용하지 않습니다. JSON 내 동일 ID의 대소문자 중복은 오류로 보고 재정리를 요구합니다. 유효한 항목을 기존 모음에 적용할 때는 정규화된 ID로 병합하며 **기존 메모/저장일을 유지하고 개인 태그를 합칩니다**. 원문 태그와 개인 태그는 별도입니다. 원문 메타데이터가 갱신되어도 개인 태그/메모를 덮어쓰지 않습니다.

개인 태그는 최대 20개(각 60자), 메모는 최대 4,000자입니다. 모음 한도는 10,000개이지만 브라우저 localStorage 실제 용량은 이보다 먼저 찰 수 있습니다. 쓰기가 실패하면 기기 저장 성공이라고 표시하지 않고 JSON 내보내기를 안내합니다. 여러 기기 동기화/서버 저장은 제공하지 않습니다.

검색은 120ms 지연 후 적용하며, 전체 데이터 검색/정렬과 화면 렌더링을 분리해 페이지당 60개만 DOM으로 만듭니다. 모의 대량 데이터는 `tests/`에서만 생성하며 실제 스냅샷에 포함하지 않습니다.

동봉 스냅샷 갱신:

```bash
python3 scripts/collect-snapshot.py
```

이 명령은 인증 없이 공개 API를 읽고 전체 수집/검증이 끝난 뒤 스냅샷을 교체합니다. `data/curation.json`의 README 검토 날짜·해시는 API 갱신으로 새 날짜로 덮어쓰지 않습니다. 새 항목의 한국어 요약을 추가하려면 실제 README를 검토한 후 curation에 용도·근거·문서 URL·검토일·blob SHA를 기록하세요.

## 보안

- 앱의 API 요청은 GET / `credentials: omit`. private 저장소 응답은 거부합니다.
- 본문·메모·태그는 DOM `textContent`/텍스트 노드로 출력하며 외부 HTML을 렌더하지 않습니다.
- 링크는 HTTPS만, 자격증명 포함 URL 거부; repo URL은 ID와 정확히 일치해야 합니다.
- 새 탭 링크에는 `noopener noreferrer` 및 no-referrer를 적용합니다.
- CSP로 외부 스크립트·인라인 이벤트·object·form 제출을 제한합니다.
- 가져오기에서 외부 JSON의 star 상태/README 검토/API 검증 주장을 초기화합니다.
- JSON 내보내기에는 개인 메모가 포함됩니다. 파일을 공유하기 전에 내용을 확인하세요.
- API 제한을 회피하기 위해 새 키/로그인/OAuth를 요청하지 않습니다. 일부 저장소 자체의 설치/실행은 외부 API 비용을 요구할 수 있지만 이 아카이브는 해당 서비스를 호출하지 않습니다.

## 검증

```bash
npm ci --ignore-scripts
npm test
```

개발 의존성 linkedom은 테스트용 DOM 환경이며 앱에는 로드되지 않습니다. 테스트는 공개 데이터 무결성·라이선스·검색필터·정렬·230개 Stars 4페이지 수집·부분 실패·중복·private 거부·JSON/XSS·로컬 복원·메모/태그 보존·5,000개 검색/가져오기·2,000개 복원/60개 카드 렌더를 확인합니다. DOM 테스트의 native dialog/focus shim은 실제 브라우저의 Escape/Tab/레이아웃 검증을 대신하지 않습니다.

실제 화면 확인과 남은 제한은 [검증 기록](reviews/verification.md)을 참고하세요. `tests/responsive.html`은 같은 앱을 모바일 390px / 태블릿 768px 프레임에서 비교할 수 있는 로컬 확인용 페이지입니다.

## 작업 범위

작업 브랜치: `feat/repository-atlas-20261001`. main 생성·변경·병합, 운영 배포, GitHub 공개 범위/설정 변경을 수행하지 않습니다. 자동 배포 워크플로도 추가하지 않습니다.
