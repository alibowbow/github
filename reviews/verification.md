# 구현 및 검증 기록

## 사전 확인

- `alibowbow/github`: public, size 0, branches `[]`, open PR `[]`. 기존 파일·작업 브랜치 없음.
- `alibowbow/ainew`: main `1a371dfc73c3f65eb0b8ad577a0ed3ca18796b78`의 요청한 세 파일을 읽고 실제 공개 카탈로그 UI를 브라우저에서 확인.
- 공개 Stars: 2026-10-01 23:34:56.246558 UTC, 13개 + 빈 page 2. 별도 추천 2개.
- 15개 README 본문과 API blob SHA가 모두 일치. 전문은 앱에 복사하지 않음.

## 자동 검증

- `npm test`: 35개 통과, 실패 0개.
- 핵심 로직 테스트 25개, linkedom DOM 로직 테스트 10개.
- API 페이지네이션: 테스트 전용 230개, 100/100/30/0의 4페이지 수집 통과.
- 429·네트워크·중복·private 응답 시 부분 수집 취소와 기존 데이터 유지 통과.
- 검색·모음/카테고리/언어/라이선스 필터·별 수/이름/pushed_at 정렬 통과.
- 로컬 저장·메모·개인 태그 복원, 갱신/가져오기 보존 통과.
- 잘못된 JSON·크기/개수/길이 제한·unsafe URL·prototype 필드 거부 통과.
- XSS 문자열은 텍스트로 표시, 주입 요소 없음; 새 탭 링크 보호 통과.
- 모달 close 이벤트·호출 카드 복귀는 DOM 로직에서 통과. 브라우저 기본 포커스 트랩·Escape/Tab은 별도 실기 확인 필요.
- 5,000개 모의 저장소: 검색/정렬 + JSON 검증 약 144ms.
- 2,000개 모의 로컬 항목: 복원/첫 렌더/페이지 이동 약 231ms, DOM 카드 수는 최대 60개.
- 위 시간은 이 실행 환경의 Node/DOM 테스트 결과이며 실제 휴대폰 성능 측정이 아님.
- `node --check core.js`, `node --check app.js`, Python collector 구문 확인 통과.

## 실제 브라우저 상태

- 참고 Model Atlas: 공개 웹 카탈로그 화면 열기·스크린샷으로 카드/툴바/남색 요약/3열을 확인.
- 신규 아카이브: 이 환경의 Cloud Browser가 `file://`를 보안 정책으로 거부하고 로컬 HTTP URL을 `ERR_BLOCKED_BY_CLIENT`로 차단함.
- Chromium 로컬 설치도 공식 다운로드에서 유효한 압축파일을 받지 못해 실패함.
- 신규 앱의 실제 데스크톱/모바일 화면, 실제 Escape/Tab 포커스 격리, CSP/file 실행, 실제 API CORS를 완료했다고 주장하지 않음. 신규 앱 화면 증거는 아직 없음.
- 대안으로 테스트 전용 DOM에서 렌더/이벤트/복원을 검증했지만 이것은 실제 브라우저 시각 검증이 아님.

## 남은 제한

- 인증 없는 GitHub API의 제한 때문에 큰 모음은 수집 중 중단될 수 있음. 앱은 중단을 표시하고 기존 데이터를 보존함.
- localStorage 실제 할당량·file origin 동작은 브라우저마다 다름. 저장 실패 알림과 JSON 내보내기 제공.
- 신규 저장소의 한국어 용도는 자동 번역/추론하지 않음. README 검토 전 상태로 표시.
- 운영 배포와 main 작업은 사용자가 허용하지 않아 수행하지 않음.
- 원격 첫 브랜치/커밋 생성: GitHub 연결의 create-tree가 `409 Git Repository is empty`로 거부됨. 연결의 create-commit은 기존 parent commit을 요구하므로 root commit을 만드는 경로가 없음.
- CLI `git push --dry-run`도 GitHub Username 인증 경로가 없어 실패. 브라우저의 GitHub 페이지는 로그아웃 상태임. 새 키/OAuth는 만들지 않음.
- 최종 원격 재확인: branches `[]`, open PR `[]`. main을 생성하지 않았고 운영 배포/설정 변경 없음.
- 로컬 브랜치 `feat/repository-atlas-20261001`에 root commit을 보존. 전달 ZIP은 전체 소스와 git bundle을 포함하며, 원격 branch/commit URL은 아직 존재하지 않음.
