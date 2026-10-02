# typesafe-computer-use 아카이브 추가

확인 시각: 2026-10-02T14:19:56.575Z
대상: alibowbow/github

- 원본 저장소: https://github.com/awlevin/typesafe-computer-use
- 공개 상태: public, archived=false (GitHub 공개 API 확인)
- README: https://github.com/awlevin/typesafe-computer-use/blob/44ca11f0935b021b73020825da054b5c92cc1288/README.md
- README blob SHA: 875d091f6abda81ed03252184995fbeb67a9d8b7
- LICENSE: https://github.com/awlevin/typesafe-computer-use/blob/44ca11f0935b021b73020825da054b5c92cc1288/LICENSE
- LICENSE blob SHA: 643e58a57d8c6b3121c024b3ea75b0bb12316ded
- 라이선스: MIT, Copyright (c) 2026 Aaron Levin

## 등록

기존 스키마의 별도 추천 컬렉션 · AI · 에이전트 분류에 computer-use 자동화 프레임워크로 1개 추가. 한국어 용도와 사용 상황, 베타 상태, macOS/Python 요구 조건과 Windows 실험 지원, TypeSafe API 필요 여부를 README에서 정리했다. 기존 ID/URL과 중복 없음. 출시일·모델 벤치마크·검증된 API 가격은 등록하지 않았다. 원문 API description의 비용 주장은 제작자 원문으로만 보존하며 확인 메모에서 미검증임을 표시한다.

기존 15개 데이터와 Stars 13개, Stars 수집 시각 및 페이지 기록을 유지한다. curation에 등록해 이후 전체 스냅샷 수집 때도 별도 추천 항목으로 보존한다. JSON과 오프라인 JS 번들을 함께 갱신한다. UI·스타일·라우팅·데이터 스키마와 다른 프로젝트는 변경하지 않는다. 원본 코드는 설치·실행하지 않았다.

## 검사

- npm ci --ignore-scripts: 아카이브의 기존 테스트 의존성만 설치
- npm test: 37개 모두 통과. 전체 기존 검사와 신규 항목의 데이터·교차 필터·Stars 분리·상세 출처 링크·닫기 검사
- JavaScript 구문 검사, 스냅샷 스키마·중복 및 JSON/JS 동등성 검사: 통과
- 기존 항목·수집 기록 보존 검사, git diff --check: 통과

별도 빌드 명령이 없는 정적 앱이다. DOM 검사는 실제 브라우저 레이아웃 검사를 대신하지 않는다. 이번 변경은 데이터 추가에 한정되어 반응형 CSS를 변경하지 않는다. 작업 브랜치와 draft PR까지만 작성하며 main 병합·배포는 수행하지 않는다.
