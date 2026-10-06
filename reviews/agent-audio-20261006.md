# agent-audio 아카이브 추가

확인 시각: 2026-10-06T10:03:25Z
대상: alibowbow/github

- 원본 저장소: https://github.com/AIEGOBOT/agent-audio
- 공개 상태: public, archived=false (GitHub API 확인)
- 원문 커밋: 975d804594f515e81cdb8858587af5469cf78ebf
- README: https://github.com/AIEGOBOT/agent-audio/blob/975d804594f515e81cdb8858587af5469cf78ebf/README.md
- README blob SHA: 4985c885163beb93dc20006704a1e08ebbe476a8
- LICENSE: https://github.com/AIEGOBOT/agent-audio/blob/975d804594f515e81cdb8858587af5469cf78ebf/LICENSE
- LICENSE blob SHA: f61d53f3209c0eda34f81b3f8e78e025e72f4843
- 서드파티 고지: https://github.com/AIEGOBOT/agent-audio/blob/975d804594f515e81cdb8858587af5469cf78ebf/THIRD_PARTY_NOTICES.md
- API 확인 시각: 2026-10-06T10:02:50Z
- 코드 푸시: 2026-10-05T13:17:55Z; 메타데이터 갱신: 2026-10-06T08:19:30Z

## 등록

기존 스키마의 별도 추천 컬렉션 · 음악 · 창작 분류에 1개 추가했다. Stable Audio 3 Medium을 사용하는 로컬 텍스트→WAV MCP 서버와 Agent Skill로 정리했다. 초기 프리뷰, Windows CPU 및 Apple Silicon MLX의 짧은 WAV 생성 사례와 자동 호출·완성 프로젝트 통합·청취 품질의 미검증 상태를 구분했다. 소스 MIT가 별도 모델 약관을 대체하지 않음을 명시했다. 원본 프로젝트나 모델을 설치·실행하지 않았다.

기존 16개 항목, Stars 13개, Stars 수집 시각과 페이지 기록을 유지한다. 중복은 main과 현재 열린 별도 추가 PR #4, #5의 스냅샷에서 확인했다. 두 PR을 수정하거나 병합하지 않는다. curation에 항목을 기록해 이후 전체 수집에서도 보존되도록 했으며 JSON과 오프라인 JS 번들을 함께 갱신했다. UI·스타일·데이터 스키마는 변경하지 않았다.

## 검사

- 기존 잠금 파일의 테스트 의존성을 npm ci --ignore-scripts로 설치했다. 기본 npm 캐시 경로가 쓰기 불가여서 /tmp의 전용 캐시로 재시도했다.
- npm test: 전체 42개 통과. 신규 항목의 중복·큐레이션 일치·라이선스 구분·복합 필터·Stars 분리·상세 링크·닫기 및 초기화 검사를 포함한다.
- JavaScript 구문, 스냅샷 스키마·중복 및 JSON/JS 동등성 검사: 통과
- 기존 16개 항목·Stars 수집 기록 보존 및 git diff --check: 통과

정적 앱으로 별도 빌드 명령이 없다. DOM 검사는 실제 브라우저 레이아웃·키보드 상호작용 검증을 대신하지 않는다. 작업 브랜치와 draft PR까지만 준비하며 main 병합·배포는 수행하지 않는다.

