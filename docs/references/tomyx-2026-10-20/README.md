# 전달 자료 목록과 보관 기준

- 수신·정리일: 2026-10-21
- 원본 위치: 작업 PC의 `~/Desktop/ToMyX/`
- 원문 버전: 정책·개발명세 표기 기준 `구현 기준 v1 · 2026.10.20`. 디자인 PDF는 별도 개정일을 확인하지 못했습니다.
- 확인 범위: PDF 76개, 각 1페이지. 정책 7개 + 개발명세 60개(현행 59개·LEGACY 1개) + 디자인 가이드 9개.
- 현재 기준: [제품 명세 총괄](../../specs/product-overview.md). 정책은 `docs/policy/`, 구현 계획은 `docs/specs/`에서 갱신합니다.

## 보관 방식

다른 PC와 에이전트도 원문을 검색할 수 있도록 PDF 전체 텍스트와 디자인 미리보기를 저장했습니다. 약 97.6 MB의 PDF 바이너리는 복제하지 않았습니다. 파일명과 SHA-256으로 같은 원본인지 확인할 수 있습니다. 한글 파일명은 목록에서 NFC로 정규화했습니다.

- [정책 원문](policies.md): 00, 00-A~F 공통 규칙·논리 계약·출시 기준.
- [개발명세 원문](screens.md): 59개 화면의 이벤트·기능 규칙·AC와 LEGACY 자료.
- [디자인 원문](design.md): 추출 가능한 화면 문구와 가이드. 표·화면 배치는 아래 미리보기로 확인합니다.
- `previews/`: 디자인 PDF 전체 페이지를 긴 변 1,800px로 렌더한 참고 PNG 9개. 제품용 이미지·아이콘·폰트 자산이 아닙니다. 원본 Figma의 변수·컴포넌트 속성·프로토타입 링크는 PDF에 온전히 보존되지 않습니다.

자료 속 기본값은 전달 문서에서 채택한 기준입니다. 과거 사용자 합의, 서버 구현 완료, 법무 승인, 실제 QA 통과를 뜻하지 않습니다. 원본을 해석한 결과와 추가 기술 제안은 통합 스펙에서 구분합니다. 새 결정을 반영할 때 이 스냅샷을 고쳐 과거 자료를 바꾸지 않습니다.

## 전체 파일과 반영 위치

`0-`는 정책, `1-`는 개발명세, `2-`는 디자인 가이드입니다. 화면 번호 02.01 등을 라우트 URL로 강제하지 않습니다.

| 자료 ID | 원본 상대 경로 | 원문 | 정리 문서 |
| --- | --- | --- | --- |
| 0-00 | 0. 정책/00. 개발 시작 안내 : 화면 목록.pdf | [추출문](policies.md#source-0-00) | [반영 위치](../../specs/../policy/service-rules.md) |
| 0-01 | 0. 정책/01. 공통 동작 : 입력·로그인·복귀·오류.pdf | [추출문](policies.md#source-0-01) | [반영 위치](../../specs/../policy/service-rules.md) |
| 0-02 | 0. 정책/02. 서비스 인터페이스 : 데이터·응답 계약.pdf | [추출문](policies.md#source-0-02) | [반영 위치](../../specs/service-contracts.md) |
| 0-03 | 0. 정책/03. 전체 상태 전이 : 복귀 경로.pdf | [추출문](policies.md#source-0-03) | [반영 위치](../../specs/../policy/service-rules.md) |
| 0-04 | 0. 정책/04. 출시 1차 구현 정책 : 결정 기준.pdf | [추출문](policies.md#source-0-04) | [반영 위치](../../specs/../policy/service-rules.md) |
| 0-05 | 0. 정책/05. QA : 인수 기준과 증빙.pdf | [추출문](policies.md#source-0-05) | [반영 위치](../../specs/../policy/launch-operations.md) |
| 0-06 | 0. 정책/06. 운영 설정 : 출시 전 필수 입력.pdf | [추출문](policies.md#source-0-06) | [반영 위치](../../specs/../policy/launch-operations.md) |
| 1-00.00 | 1. 개발명세/00.00 랜딩 (LEGACY).pdf | [추출문](screens.md#source-1-00-00) | [반영 위치](../../specs/product-overview.md) |
| 1-02.01 | 1. 개발명세/02.01 카톡 : 진입.pdf | [추출문](screens.md#source-1-02-01) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.02 | 1. 개발명세/02.02 카톡 : 선택.pdf | [추출문](screens.md#source-1-02-02) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.03 | 1. 개발명세/02.03 카톡 : 행동A.pdf | [추출문](screens.md#source-1-02-03) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.04 | 1. 개발명세/02.04 카톡 : 행동B.pdf | [추출문](screens.md#source-1-02-04) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.05 | 1. 개발명세/02.05 카톡 : 여운.pdf | [추출문](screens.md#source-1-02-05) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.06 | 1. 개발명세/02.06 인스타 : 진입.pdf | [추출문](screens.md#source-1-02-06) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.07 | 1. 개발명세/02.07 인스타 : 선택.pdf | [추출문](screens.md#source-1-02-07) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.08 | 1. 개발명세/02.08 인스타 : 행동 A.pdf | [추출문](screens.md#source-1-02-08) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.09 | 1. 개발명세/02.09 인스타 : 행동 B.pdf | [추출문](screens.md#source-1-02-09) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.10 | 1. 개발명세/02.10 인스타 : 여운.pdf | [추출문](screens.md#source-1-02-10) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.11 | 1. 개발명세/02.11 자니 : 진입.pdf | [추출문](screens.md#source-1-02-11) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.12 | 1. 개발명세/02.12 자니 : 선택.pdf | [추출문](screens.md#source-1-02-12) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.13 | 1. 개발명세/02.13 자니 : 행동 A.pdf | [추출문](screens.md#source-1-02-13) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.14 | 1. 개발명세/02.14 자니 : 행동 B.pdf | [추출문](screens.md#source-1-02-14) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-02.15 | 1. 개발명세/02.15 자니 : 여운.pdf | [추출문](screens.md#source-1-02-15) | [반영 위치](../../specs/onboarding-simulation.md) |
| 1-03.01 | 1. 개발명세/03.01 글쓰기 : 바로쓰기 · 빈 상태.pdf | [추출문](screens.md#source-1-03-01) | [반영 위치](../../specs/story-writing.md) |
| 1-03.02 | 1. 개발명세/03.02 글쓰기 : 본문 입력.pdf | [추출문](screens.md#source-1-03-02) | [반영 위치](../../specs/story-writing.md) |
| 1-03.03 | 1. 개발명세/03.03 글쓰기 : 공개 미리보기.pdf | [추출문](screens.md#source-1-03-03) | [반영 위치](../../specs/story-writing.md) |
| 1-03.04 | 1. 개발명세/03.04 글쓰기 : 공개 확인.pdf | [추출문](screens.md#source-1-03-04) | [반영 위치](../../specs/story-writing.md) |
| 1-03.05 | 1. 개발명세/03.05 글쓰기 : 등록 중.pdf | [추출문](screens.md#source-1-03-05) | [반영 위치](../../specs/story-writing.md) |
| 1-03.06 | 1. 개발명세/03.06 글쓰기 : 등록 완료.pdf | [추출문](screens.md#source-1-03-06) | [반영 위치](../../specs/story-writing.md) |
| 1-03.07 | 1. 개발명세/03.07 글쓰기 : 입력 확인.pdf | [추출문](screens.md#source-1-03-07) | [반영 위치](../../specs/story-writing.md) |
| 1-03.08 | 1. 개발명세/03.08 글쓰기 : 긴 글 입력.pdf | [추출문](screens.md#source-1-03-08) | [반영 위치](../../specs/story-writing.md) |
| 1-03.09 | 1. 개발명세/03.09 글쓰기 : 초안 이어쓰기.pdf | [추출문](screens.md#source-1-03-09) | [반영 위치](../../specs/story-writing.md) |
| 1-03.10 | 1. 개발명세/03.10 글쓰기 : 나가기 확인.pdf | [추출문](screens.md#source-1-03-10) | [반영 위치](../../specs/story-writing.md) |
| 1-03.11 | 1. 개발명세/03.11 글쓰기 : 등록 실패.pdf | [추출문](screens.md#source-1-03-11) | [반영 위치](../../specs/story-writing.md) |
| 1-03.12 | 1. 개발명세/03.12 글쓰기 : 재시도 중.pdf | [추출문](screens.md#source-1-03-12) | [반영 위치](../../specs/story-writing.md) |
| 1-04.01 | 1. 개발명세/04.01 메인 : 스토리.pdf | [추출문](screens.md#source-1-04-01) | [반영 위치](../../specs/story-feed.md) |
| 1-04.02 | 1. 개발명세/04.02 메인 : 스크롤 후.pdf | [추출문](screens.md#source-1-04-02) | [반영 위치](../../specs/story-feed.md) |
| 1-04.03 | 1. 개발명세/04.03 메인 : 이야기 없음.pdf | [추출문](screens.md#source-1-04-03) | [반영 위치](../../specs/story-feed.md) |
| 1-04.04 | 1. 개발명세/04.04 메인 : 불러오기 실패.pdf | [추출문](screens.md#source-1-04-04) | [반영 위치](../../specs/story-feed.md) |
| 1-05.01 | 1. 개발명세/05.01 알림 : 빈 상태.pdf | [추출문](screens.md#source-1-05-01) | [반영 위치](../../specs/story-feed.md) |
| 1-05.02 | 1. 개발명세/05.02 알림 : 목록.pdf | [추출문](screens.md#source-1-05-02) | [반영 위치](../../specs/story-feed.md) |
| 1-05.03 | 1. 개발명세/05.03 알림 : 로그인 전.pdf | [추출문](screens.md#source-1-05-03) | [반영 위치](../../specs/story-feed.md) |
| 1-06.01 | 1. 개발명세/06.01 MY : 내 이야기 없음.pdf | [추출문](screens.md#source-1-06-01) | [반영 위치](../../specs/story-feed.md) |
| 1-06.02 | 1. 개발명세/06.02 MY : 내 이야기 목록.pdf | [추출문](screens.md#source-1-06-02) | [반영 위치](../../specs/story-feed.md) |
| 1-06.03 | 1. 개발명세/06.03 MY : 내 이야기 상세.pdf | [추출문](screens.md#source-1-06-03) | [반영 위치](../../specs/story-feed.md) |
| 1-07.01 | 1. 개발명세/07.01 공유 : 이야기 링크.pdf | [추출문](screens.md#source-1-07-01) | [반영 위치](../../specs/story-feed.md) |
| 1-07.02 | 1. 개발명세/07.02 공유 : 복사 완료.pdf | [추출문](screens.md#source-1-07-02) | [반영 위치](../../specs/story-feed.md) |
| 1-07.03 | 1. 개발명세/07.03 더보기 : 이야기 관리.pdf | [추출문](screens.md#source-1-07-03) | [반영 위치](../../specs/story-feed.md) |
| 1-07.04 | 1. 개발명세/07.04 숨기기 : 확인.pdf | [추출문](screens.md#source-1-07-04) | [반영 위치](../../specs/story-feed.md) |
| 1-07.05 | 1. 개발명세/07.05 숨기기 : 완료.pdf | [추출문](screens.md#source-1-07-05) | [반영 위치](../../specs/story-feed.md) |
| 1-07.06 | 1. 개발명세/07.06 신고 : 사유 선택.pdf | [추출문](screens.md#source-1-07-06) | [반영 위치](../../specs/story-feed.md) |
| 1-07.07 | 1. 개발명세/07.07 신고 : 접수 완료.pdf | [추출문](screens.md#source-1-07-07) | [반영 위치](../../specs/story-feed.md) |
| 1-07.08 | 1. 개발명세/07.08 차단 : 작성자 확인.pdf | [추출문](screens.md#source-1-07-08) | [반영 위치](../../specs/story-feed.md) |
| 1-07.09 | 1. 개발명세/07.09 이야기 : 열람 불가.pdf | [추출문](screens.md#source-1-07-09) | [반영 위치](../../specs/story-feed.md) |
| 1-08.01 | 1. 개발명세/08.01 로그인 : 시작.pdf | [추출문](screens.md#source-1-08-01) | [반영 위치](../../specs/account-access.md) |
| 1-08.02 | 1. 개발명세/08.02 로그인 : 글쓰기 시트.pdf | [추출문](screens.md#source-1-08-02) | [반영 위치](../../specs/account-access.md) |
| 1-08.03 | 1. 개발명세/08.03 로그인 : 공감 시트.pdf | [추출문](screens.md#source-1-08-03) | [반영 위치](../../specs/account-access.md) |
| 1-08.04 | 1. 개발명세/08.04 로그인 : 진행 중.pdf | [추출문](screens.md#source-1-08-04) | [반영 위치](../../specs/account-access.md) |
| 1-08.05 | 1. 개발명세/08.05 로그인 : 실패.pdf | [추출문](screens.md#source-1-08-05) | [반영 위치](../../specs/account-access.md) |
| 1-08.06 | 1. 개발명세/08.06 약관 : 동의.pdf | [추출문](screens.md#source-1-08-06) | [반영 위치](../../specs/account-access.md) |
| 1-08.07 | 1. 개발명세/08.07 MY : 로그인 전.pdf | [추출문](screens.md#source-1-08-07) | [반영 위치](../../specs/account-access.md) |
| 1-09.01 | 1. 개발명세/09.01 설정 : 메인.pdf | [추출문](screens.md#source-1-09-01) | [반영 위치](../../specs/account-access.md) |
| 1-09.02 | 1. 개발명세/09.02 설정 : 이용약관.pdf | [추출문](screens.md#source-1-09-02) | [반영 위치](../../specs/account-access.md) |
| 1-09.03 | 1. 개발명세/09.03 설정 : 개인정보 처리방침.pdf | [추출문](screens.md#source-1-09-03) | [반영 위치](../../specs/account-access.md) |
| 1-09.04 | 1. 개발명세/09.04 로그아웃 : 확인.pdf | [추출문](screens.md#source-1-09-04) | [반영 위치](../../specs/account-access.md) |
| 1-09.05 | 1. 개발명세/09.05 탈퇴 : 안내.pdf | [추출문](screens.md#source-1-09-05) | [반영 위치](../../specs/account-access.md) |
| 1-09.06 | 1. 개발명세/09.06 탈퇴 : 완료.pdf | [추출문](screens.md#source-1-09-06) | [반영 위치](../../specs/account-access.md) |
| 2-00 | 2. 디자인 가이드/00 · 디자인 토큰.pdf | [추출문](design.md#source-2-00) | [반영 위치](../../specs/design-system.md) |
| 2-02 | 2. 디자인 가이드/02 · 첫 방문 — 랜덤 시뮬레이션 · 세 가지 배정 후보.pdf | [추출문](design.md#source-2-02) | [반영 위치](../../specs/design-system.md) |
| 2-03 | 2. 디자인 가이드/03 · 글쓰기 — 바로 작성 → 공개 → 완료.pdf | [추출문](design.md#source-2-03) | [반영 위치](../../specs/design-system.md) |
| 2-04 | 2. 디자인 가이드/04 · 재방문 메인 — 내 X의 흔적을 찾는 피드.pdf | [추출문](design.md#source-2-04) | [반영 위치](../../specs/design-system.md) |
| 2-05 | 2. 디자인 가이드/05 · 알림 — 목록 · 빈 상태.pdf | [추출문](design.md#source-2-05) | [반영 위치](../../specs/design-system.md) |
| 2-06 | 2. 디자인 가이드/06 · MY — 내 이야기 · 상세.pdf | [추출문](design.md#source-2-06) | [반영 위치](../../specs/design-system.md) |
| 2-07 | 2. 디자인 가이드/07 · 이야기 관리 — 공유 · 숨기기 · 신고 · 차단.pdf | [추출문](design.md#source-2-07) | [반영 위치](../../specs/design-system.md) |
| 2-08 | 2. 디자인 가이드/08 · 로그인 — 둘러보기는 자유롭게 · 필요한 순간에만.pdf | [추출문](design.md#source-2-08) | [반영 위치](../../specs/design-system.md) |
| 2-09 | 2. 디자인 가이드/09 · 설정 — 계정 · 약관 · 로그아웃 · 탈퇴.pdf | [추출문](design.md#source-2-09) | [반영 위치](../../specs/design-system.md) |

## 디자인 미리보기

| 자료 | 전체 페이지 |
| --- | --- |
| 00 · 디자인 토큰.pdf | [보기](previews/2-00.png) |
| 02 · 첫 방문 — 랜덤 시뮬레이션 · 세 가지 배정 후보.pdf | [보기](previews/2-02.png) |
| 03 · 글쓰기 — 바로 작성 → 공개 → 완료.pdf | [보기](previews/2-03.png) |
| 04 · 재방문 메인 — 내 X의 흔적을 찾는 피드.pdf | [보기](previews/2-04.png) |
| 05 · 알림 — 목록 · 빈 상태.pdf | [보기](previews/2-05.png) |
| 06 · MY — 내 이야기 · 상세.pdf | [보기](previews/2-06.png) |
| 07 · 이야기 관리 — 공유 · 숨기기 · 신고 · 차단.pdf | [보기](previews/2-07.png) |
| 08 · 로그인 — 둘러보기는 자유롭게 · 필요한 순간에만.pdf | [보기](previews/2-08.png) |
| 09 · 설정 — 계정 · 약관 · 로그아웃 · 탈퇴.pdf | [보기](previews/2-09.png) |

## 원본 식별값

| 자료 ID | 바이트 | SHA-256 |
| --- | --- | --- |
| 0-00 | 1804668 | `081e9ef3a86d45f296befcd442f5eea35ff5a663bc0e8bc3da727f21b1abb6e1` |
| 0-01 | 1120798 | `46b839abdae078ef4c024099be95b274745a7e6987a148a5574d6e6edbf2ec5d` |
| 0-02 | 1451104 | `c0ae8e55c0927ae55e2d9fda0a4aa97456ca5f3c3284dd8314fea3dbba58cf08` |
| 0-03 | 760603 | `0540339172994ab611ad221f499deac53ecd31c621f16818747929b12958dc33` |
| 0-04 | 731307 | `cebdaaf228df8b57bc92f89e0db9e71aaa252d38d8a9b34be96550d6bc32077a` |
| 0-05 | 934662 | `3b44d4c33cef7f9b081ac2a333e56d49c896426c4c26f9f41c4b555519095270` |
| 0-06 | 759550 | `8e84e954320277a6f5ee504f05192529ecfa1a7b2ed6f905f6a2ae0eb42c571d` |
| 1-00.00 | 105322 | `c4f1aa26d88334b6c60d4242a7fe84bcaeadcc91267f5db08c7de2414b278a1b` |
| 1-02.01 | 1494821 | `7f2848766c8db41f2c98d6b49691f405836034d68aba618f47022169969a934b` |
| 1-02.02 | 1643152 | `51f54114c16f20530c406645bd4e1946dceedd83398239f58c86794f2dfcbd4d` |
| 1-02.03 | 1526807 | `e5ac98130af72d2c75102bb827b9c5948bfa5e46575d7b1b0cf48b693ca80ddc` |
| 1-02.04 | 1189060 | `0f80d4b3473d2d86ef8d467109e7e5740c8d24264416a219fe8bbab4feef9382` |
| 1-02.05 | 1107229 | `70280aef3688399f99315136854c19cff93a06070744d070454e21dc58533b23` |
| 1-02.06 | 1497461 | `3fbc1d74c6d226c30824795d6487cc9968b15bf91ff70033e73e5c78c6074dc5` |
| 1-02.07 | 1787489 | `a033e121b9b4142ad6686a39993ab596a75503a639e8f08e766f470f3f25fae1` |
| 1-02.08 | 1561573 | `0079526747a0baedbbef05b9ffd5434ba9e8ecac16b10d82aca20f50a1984d3f` |
| 1-02.09 | 1214682 | `c338cabf7d8c65525c979415ac48e714d9b8b8047ccda91c9a2d58bc3be86c13` |
| 1-02.10 | 1121738 | `676aeeec1a57d560b068a85ee17ad1211ae3ae765e1e34a8dced0c2d2c05ecb0` |
| 1-02.11 | 1605712 | `46f0c36f19eda8df941e4a1b619545cbbfea819af842418e49fd7df8d6eef842` |
| 1-02.12 | 1659835 | `85dff00141b951fc19c7652cd4ff409a99f1aa94dc255110c795ba3a7e0ed95a` |
| 1-02.13 | 1429089 | `315d5235184589f3f96465a8878ed06f6fb0638e37702ff5011acbb5274f687d` |
| 1-02.14 | 884784 | `c58c5721fcf8025f8b050b88243c2f1881271bf90e7d121795b01f53fa72000b` |
| 1-02.15 | 783298 | `091047c655f1412df983c02770d113fe94f6cedd6f31f99d85d9dcf910912fa4` |
| 1-03.01 | 1337884 | `8e770d15bf9474f5d9d0437b165dad4b154b71b1879f99ee6b3cff53ea0529b9` |
| 1-03.02 | 1398892 | `2186665772bdbd0d3ba8bf0c047556165b21cc10b58cdeb61bd808f0ffc440e2` |
| 1-03.03 | 937049 | `5f2716de048147a637e4773e68a0a2d69b408d5a92714c0d2822ab73ccb4c130` |
| 1-03.04 | 945187 | `48f816e80f3e4ab8329526e85457d26e0d21fa052c97985886d11ae7fd345eb3` |
| 1-03.05 | 956716 | `9ca71c931344accccdbba10240614b8ca3cfab1b50af7d17c57bd797dc9b56e5` |
| 1-03.06 | 983327 | `b1562440f6b055268b72c8b27ed462c65847c3113cba06d9eff649fe559ee324` |
| 1-03.07 | 1336587 | `6704a70b2e71e8c2c318b96d41d0e7e66d544639efb0441588c6f7af80dd0e4e` |
| 1-03.08 | 1670035 | `06caa16dc7b3c95daa295048491cdeb6838b7e2aec59a3a220c318639f14fe51` |
| 1-03.09 | 1116581 | `461db4a41b54c923180befb16b8f4cd4d40d5e0a6a18674c97e1c1d26446b1cd` |
| 1-03.10 | 824429 | `0197f96b9930a732472c47908f5d0724f71c968ecc5c4179406002dd900fb408` |
| 1-03.11 | 922795 | `dabcfb4bddc0c721e9df7c8a0db0727df81b55abf5fa0a86eb06028ab11d6405` |
| 1-03.12 | 949014 | `a730848ee4aeea145216faf46b7a5421bd5c6e43f27e69ef1bd17012815b6a3d` |
| 1-04.01 | 2494177 | `f893be9a94e07853b133ec230a087d2249a5a4acada816aa99addd50f6ad22d4` |
| 1-04.02 | 2283638 | `4d27faf34165fca17465c932d5e919221d4281922ca34a255c061add95f2b200` |
| 1-04.03 | 1524542 | `8cf6543aaea28752ef6114d99fa668471757bcc936ba68edffeb038859df9d68` |
| 1-04.04 | 1461467 | `9e57a543a7634d4194970dc3eccc559d02cb4ed7c424c933830fb475f9ff24e2` |
| 1-05.01 | 538164 | `023ff5f9fe5a931f84cc662654c1b59d9434c43e01e84917522044bcedfe2b30` |
| 1-05.02 | 858845 | `f780e6fbf3b5099c7ef506306374f201d8fd979e6afdf25ad89bcd018cc13a64` |
| 1-05.03 | 729079 | `eb739e1dff0bb2276d0829ce774c7cc4bd42b58539982e9762d8f0279183bc9f` |
| 1-06.01 | 1082303 | `229498d02c7d395fb843aa299a397814aff2a00cea49f8c423fb2b54274a3b81` |
| 1-06.02 | 1308808 | `dcf7c0ff223f7b4043755c7bce206239c509a6298efa1ec3373d2add04a9b20c` |
| 1-06.03 | 893357 | `a492554a37ce1741be7995f50c2c57a34731870ea86a8b0d10e247f483542257` |
| 1-07.01 | 837865 | `0f0e11a52687fd59aeb9c551129767b46948ffcb8aec1ac67fc9d0f34aa7e9a4` |
| 1-07.02 | 642799 | `e4380c5228e16dd68120cbb2230aea30404b2f74cc0e65d2ee122a5746ef4f7f` |
| 1-07.03 | 1197313 | `9214e10503c70adff1b0200d7e6826df0f9a49315ada0c37a52c7ad7a0c348a5` |
| 1-07.04 | 680720 | `da6f7f03e0316bd17bd43daa388c83271d006f99fdf273323dc239fdbb54bd9c` |
| 1-07.05 | 531024 | `2acf61d2d879dd84025da6d94c130dd05323ae71040575a69abaa8f89dcf445e` |
| 1-07.06 | 944189 | `6aed4ca8cba9356a2350b14f27d78b707c7bdf62d7c5c916729dd92858193a74` |
| 1-07.07 | 549759 | `b637ddda52056254807518e1c63ec2a42980c4c7600795e4d12e9e6b9120a872` |
| 1-07.08 | 744185 | `9f50f21f28701ca18e2ff707497cad39314ca016c24a186041923a192ebd39b1` |
| 1-07.09 | 568518 | `3ec3d62b0de020d41c1cdd27d3e37478097808ca807ac1ad646c1b961332f02b` |
| 1-08.01 | 1523059 | `dc955220ba4b00a4d8f58b399aa7bbb7456468cd28ea90e19de871e5b8a46586` |
| 1-08.02 | 1645126 | `f2c244a3ec42ac605e30aab9b2bc155072bb3f8f5f7ab5b495fb9db97661bc82` |
| 1-08.03 | 1644145 | `1f7e27f4d42c571d35a57401a93b3efe57dea3499872c49c69e812639dfa0660` |
| 1-08.04 | 798975 | `b04b8f37e61498ca43b5fcfc1e565674d7ff1e6b68c62be2662f89403be81a93` |
| 1-08.05 | 753732 | `6332611e4d89fcacf63907811e7c22fd2abb3108d03ef4633afdd49dd44a19ca` |
| 1-08.06 | 1370133 | `06ce603864eb8a90e8d80e685dcacd282a86419582cdb7911e70002d0d450ee5` |
| 1-08.07 | 855793 | `8f492c48c9b8095c7afbf3fa51a54d788c57a88a54789d961680d0d318a6d72e` |
| 1-09.01 | 1373606 | `9792221888e1ba964e522797e12ace48ff5aa3f76b6a03b1702725dcb86b6bc9` |
| 1-09.02 | 777064 | `b13d8f15969a9cc6d2bf38407d78a8c41c921a70eac9e578ee3cfbb94414928d` |
| 1-09.03 | 788190 | `30e520afc1f32a72f17bf932950e8d6b384d87e607bbae6e8b2fc16b646cb080` |
| 1-09.04 | 762470 | `3f2fc101f22cf3b8767364630bef30855a6e9369d4b6703df47ff06ae0a86ed6` |
| 1-09.05 | 1002063 | `5f1d50260005efea057a16a8bd0a6e70107b2f2fafbc65ef1d50eb9c5acf2d05` |
| 1-09.06 | 547053 | `cfed3aab95f3f80fa84f168a5cc4f8672350f2c67dc7e93b36d1ec401bab7e7f` |
| 2-00 | 1524538 | `2041d4ed9977d5ddfc647980edbc6483326b8acc1e032f166c48e7569e2d1f0f` |
| 2-02 | 10419970 | `cb4d887f161f654de9eccdddaf6b5d9fd2a2998ef01b86123bf5e5722e874995` |
| 2-03 | 4070959 | `79793013f6f21dd7427c3e3795b1edec1abe4416fd46ef197562153faa5623cb` |
| 2-04 | 2337686 | `e8670a76790fd808d6e45b268b800649e99f0f8a174eb358f7250cfaab28f9b3` |
| 2-05 | 258251 | `dde4711caf6b38fc025a0b4cbe8b35371cf6fc4e1655d03c04893b819e05846d` |
| 2-06 | 591775 | `135888dba430af5339436952cd9bcba1807f75f16c66625fb3aa85b1f3b0e1a6` |
| 2-07 | 1283646 | `df75bad2ac462593302cb713fec8bb184a0833ff0cdcc1e1c44f3c202581d521` |
| 2-08 | 1153011 | `cf58d2567344f1600fdc8d00788722f8070e654b1f11474a9b5c885a7d111108` |
| 2-09 | 703222 | `25612d9794a0007ab7d402ad2e2f373cd402edd6b4d622bfbd6e08612d98c0d3` |
