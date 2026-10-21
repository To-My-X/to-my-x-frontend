# 공통 데이터·응답·복귀 계약

## 문서 정보

- 유형: 공통 기능·사용자 흐름·기술 계약
- 명세 상태: 초안. 전달 자료의 논리 계약을 기록했으며 실제 서버 API 합의는 미확인입니다.
- 구현 상태: 미착수
- 검증 상태: 일부 확인. 자료 대조 완료, 제품 기능 검증 미실행
- 갱신일: 2026-10-21
- 입력 자료: `0. 정책/01. 공통 동작 : 입력·로그인·복귀·오류.pdf`(`00-A`), `02. 서비스 인터페이스 : 데이터·응답 계약.pdf`(`00-B`), `03. 전체 상태 전이 : 복귀 경로.pdf`(`00-C`), 구현 기준 v1 · 2026.10.20. [자료 목록](../references/tomyx-2026-10-20/README.md), [정책 추출본](../references/tomyx-2026-10-20/policies.md)
- 확정 근거: 사용자가 전달 자료를 저장소 docs로 정리하도록 요청했습니다. 논리 연산·필드명은 자료의 정의이며 REST 경로·SDK·DB 스키마·서버 구현 완료를 뜻하지 않습니다.
- 관련 정책: [서비스 이용과 콘텐츠](../policy/service-rules.md), [출시 운영값과 인수 기준](../policy/launch-operations.md)
- 관련 스펙: [제품 범위·자료 목록](product-overview.md), [프론트엔드 아키텍처](frontend-architecture.md), [글쓰기](story-writing.md), [피드·관리](story-feed.md), [계정과 접근](account-access.md)

## 1. 목적과 범위 — PRD

각 화면이 같은 인증 상태·데이터·오류·복귀 규칙을 사용하도록 UI와 서비스 계층의 경계를 정합니다. 서버가 준비되기 전에는 이 계약을 따르는 mock으로 화면을 검수할 수 있습니다. mock 동작을 실제 서버 연동으로 보고하지 않습니다.

이번 범위는 계약 기록입니다. 제품 코드·API endpoint·인증 라이브러리·상태 관리 도구는 확정하거나 설치하지 않습니다. 서비스 규칙의 원본은 정책 문서에 두고 화면별 UI와 상세 이벤트는 각 기능 스펙을 참조합니다.

| ID | 요구사항 | 근거 |
| --- | --- | --- |
| CONTRACT-01 | 성공·실패·빈 목록을 구별하고 요청을 추적할 수 있어야 함 | `00-A / REQUEST·ERROR·EMPTY`, `00-B / 공통 응답` |
| CONTRACT-02 | 로그인·동의·취소 뒤 원래 대상과 의도를 안전하게 복원 | [D-03](../policy/service-rules.md#d-03--익명과-계정-권한), `00-C` |
| CONTRACT-03 | 응답 유실·재시도에서도 등록·탈퇴·공감 등의 중복 효과를 방지 | [D-05](../policy/service-rules.md#d-05--공개와-글의-생명주기), `00-B` |
| CONTRACT-04 | 개인 데이터와 초안을 계정 경계로 분리 | [D-02](../policy/service-rules.md#d-02--초안과-진행-보관), `00-C / 앱 종료·복귀` |

## 2. 정보 구조와 흐름 — IA

### 인증과 복귀

인증이 필요한 동작에서 `originRoute`, `postId`, `authorId`, `action`, `desiredReaction`, `scroll`, `draftKey`를 1회성 의도로 저장합니다. 필드의 타입·필수 여부·저장 TTL은 원문에 없으므로 서버와 클라이언트 설계 시 확정합니다.

`요청 동작 → 해당 로그인 화면 → 08.04 → 필요 시 08.06 → 권한·대상 재조회 → 원래 흐름 복귀` 순서입니다. 공감은 목표 상태 한 번 적용, 신고·차단은 각각 사유 선택·확인 화면으로 복귀합니다. 취소·실패·대상 소멸 시 동작하지 않습니다. 동의 저장 실패 후 보호 API를 실행하지 않습니다.

### 전체 흐름 연결

| 진입·조건 | 다음 상태 | 참조 |
| --- | --- | --- |
| 일반 진입 | 공유 링크·진행 이력·완료 이력 판정 후 시뮬레이션 또는 피드 | [시뮬레이션](onboarding-simulation.md) |
| 공유 URL | 대상 공개 이야기 직접 조회, 접근 불가와 일시 장애 분리 | [피드·관리](story-feed.md) |
| 로그인 후 쓰기 | 초안 없음 `03.01`, 있음 `03.09` | [글쓰기](story-writing.md) |
| 등록 요청의 응답 유실 | 같은 `submissionId` 결과 확인 후 완료·실패·미확정 구분 | 아래 등록 계약 |
| MY·알림 진입 | 인증 필요와 데이터 0건·1건 이상·오류 분리 | [계정과 접근](account-access.md) |
| 앱 종료 후 복귀 | 세션 검증·개인 데이터 재조회, 미확정 등록·탈퇴 먼저 조회 | 아래 상태 소유 제안 |
| 로그아웃 성공 | 개인 데이터 정리 후 `08.07`, 서버 글 보존 | [계정과 접근](account-access.md) |
| 탈퇴 완료 | `09.06 → 04.01` 게스트, 이전 보호 화면 복원 금지 | [계정과 접근](account-access.md) |

### 공통 화면 상태

| 상태 | 표시·동작 |
| --- | --- |
| 최초 조회 중 | 내용 영역 로딩. 0건 안내를 먼저 표시하지 않음 |
| 추가 조회 중 | 기존 목록 유지, 말미에 진행 표시 |
| 조회 실패 | 현재 화면에서 오류·사용자 재시도. 실패를 빈 목록으로 바꾸지 않음 |
| 변경 요청 중 | 같은 액션 중복 탭 잠금. 처리 중 시트 닫기 잠금, 로그인 취소는 예외 |
| `15초` 무응답 | 읽기는 오류, 변경은 결과 불명과 확정 실패 구분. 변경 요청 자동 반복 금지 |
| 권한·대상 없음 | 아래 오류 코드 분기에 따라 인증 또는 `07.09`. 접근 불가 본문은 노출하지 않음 |

뒤로 가기는 실제 진입 화면·탭·대상·스크롤을 복원하며 이력이 없으면 `04.01`입니다. 키보드가 보일 때 첫 뒤로 가기는 키보드만 닫습니다. 시트 바깥 탭·뒤로는 시트를 닫고, 닫힌 뒤 호출 버튼으로 포커스를 복원합니다. 열린 시트의 배경은 터치와 보조 읽기를 비활성화합니다. 플랫폼별 구현과 시각 기준은 [디자인 기준](design-system.md)을 따릅니다.

## 3. 구현 설계 — Tech Spec

### 공통 응답과 데이터 형식

다음은 `00-B`의 논리 계약입니다. 확인하지 않은 HTTP 상태 코드나 endpoint는 만들지 않습니다.

| 구분 | 필드·규칙 |
| --- | --- |
| 성공 | `data`, `requestId` |
| 실패 | `error.code`, `messageKey`, `fieldErrors`(있을 때), `retryAfter`(있을 때), `requestId`. `code` 외 필드의 실제 JSON 중첩 구조는 서버 합의 필요 |
| 목록 | `items[]`, `nextCursor \| null`, `hasMore` |
| 시간 | 서버 ISO 시각, UTC 저장, 화면은 사용자 시간대로 변환 |
| ID | 불투명 문자열. 샘플 값이나 문자열 형태로 사용자·권한을 추론하지 않음 |

`Post` 필드는 `id`, `body`, `summary`, `publishedAt`, `visibility`, `isMine`, `reactionCount`, `reacted`, `shareUrl`입니다. `authorId`는 차단에만 사용하고 외부에 표시하지 않습니다. `backgroundAsset`, `displayMetadata`는 선택 필드입니다. `visibility`의 enum, 선택 필드의 내부 구조·null 허용 범위는 원문에 없습니다.

### 논리 연산 목록

| 영역 | 연산과 결과 | 책임·제약 |
| --- | --- | --- |
| 인증 | `startLogin(provider, attemptId, returnIntent)` / `completeLogin` → `userId, provider, session, consentRequired` | `cancelLogin(attemptId)` 이후 콜백 무효. 공급자 오류·취소 분리 |
| 동의 | `getConsentDocuments` → `terms/privacy`의 `version, effectiveAt, body`; `acceptConsent(versions, age14Confirmed)` | 서버가 사용자·동의 시각 기록 후 보호 기능 사용 가능 상태 반환 |
| 읽기 | `listFeed(cursor, limit=20)`, `listMyPosts(cursor, limit=20)`, `getPost(postId)` | 내 글의 `listMyPosts/getMyDetail`은 서버 소유권 검사. `getMyDetail`의 구체 인자는 미정 |
| 등록 | `createPost(body, submissionId)`, `getSubmission(submissionId)` | `PENDING \| SUCCEEDED(postId) \| FAILED \| UNKNOWN` |
| 공감 | `setReaction(postId, desiredState, operationId)` → `reacted, reactionCount` | 토글 횟수가 아닌 최종 목표 상태 전달 |
| 공유 | `getShareLink(postId)` → 공개 URL | 권한·공개 상태·대상 존재 검증 |
| 숨김·차단 | `hidePost(postId, operationId)`, `blockAuthor(authorId, operationId)` → 서버 저장 결과 | 게스트 숨김은 브라우저 저장으로 별도 처리 |
| 신고 | `reportPost(postId, reason, operationId)` → `receiptId, alreadyReported` | 사유 enum과 중복 규칙은 D-07 참조 |
| 알림 | `listNotifications(cursor, 20)` → `items(id, type, message, createdAt, readAt, postId \| null), unreadCount`; `markNotificationRead(id)` | 읽음 저장 성공 후 항목·벨 갱신. 종류 `WELCOME`, `POST_CREATED` |
| 설정 | `getAccountSettings` → `provider, pushEnabled, pushCapability, permission` | 실제 계정·플랫폼 상태 반영 |
| Push | `subscribePush(subscription, operationId)`, `unsubscribePush(subscriptionId, operationId)` | 서버 구독 저장 성공 전 ON 금지 |
| 로그아웃 | `logout(operationId)` | 현재 세션·푸시 연결 종료 |
| 탈퇴 | `deleteAccount(operationId)`, `getDeletionStatus(operationId)` → `PENDING \| SUCCEEDED \| FAILED` | 같은 요청은 같은 결과. 서버 제거 완료 확인 후 완료 화면 |

각 연산의 필수 인자·세션 갱신·권한 오류·페이지 커서 수명·네트워크 취소는 실제 서버 계약에서 확정할 항목입니다. 클라이언트 토큰·비밀키와 내부 오류 원문을 UI나 로그에 출력하지 않습니다.

### 결과 불명과 중복 방지

- 등록은 같은 사용자와 `submissionId`에 최대 한 게시글만 허용합니다. 결과 불명 시 기존 시도를 조회하고, 미등록이 확인된 뒤 같은 ID로 다시 요청합니다. 실패 확정 후 본문을 수정하고 새로 제출할 때만 새 ID를 사용합니다.
- `UNKNOWN`과 미등록 확정은 같은 상태라고 정의되지 않았습니다. 새 요청을 허용하는 판정 조건·조회 주기·보관 기간은 서버와 확인해야 합니다.
- 등록·탈퇴가 미확정인 채 앱이 종료되면 복귀 시 결과 확인을 우선합니다. 원문에는 등록·탈퇴 외 모든 변경 연산을 조회하는 공통 API가 없으므로 임의로 있다고 가정하지 않습니다.
- 목록은 서버 커서와 같은 ID 중복 제거를 적용합니다. 첫 조회 커서를 기준으로 이어 읽고 등록·숨김·차단 성공 후 영향을 받은 목록을 무효화합니다. 비공개 원문을 클라이언트에 받은 뒤 가리는 방식은 금지합니다.
- 본문 검증·요약은 [INPUT·SUMMARY](../policy/service-rules.md#inputsummary--본문과-자동-요약)를 서버에서도 재검증합니다. 사용자 인식 문자 분할 방식과 버전은 양쪽에서 일치시켜야 합니다.

### 오류 분기

| `error.code` | UI·복구 동작 |
| --- | --- |
| `UNAUTHENTICATED` | 의도·입력을 보존하고 동작에 맞는 `08` 로그인 진입 |
| `CONSENT_REQUIRED` | `08.06` |
| `VALIDATION` | `03.07` 또는 해당 입력·사유 아래 오류 |
| `NOT_FOUND`, `FORBIDDEN`, `UNAVAILABLE` | 원문 기준 `07.09`, 본문 미노출. 게시글 외 연산의 동일 오류를 어느 화면에 표시할지는 개별 기능에서 확인 필요 |
| `NETWORK`, `TIMEOUT`, `SERVER_ERROR` | 현재 화면의 오류·재시도, 원문의 `C-ERROR` 공통 상태 |
| `RATE_LIMITED` | 서버 `retryAfter` 동안 비활성·남은 시간 안내. 단위·기준 시각은 미정 |

### 구현 책임과 상태 소유 제안

다음 배치는 아직 구현하지 않은 제안입니다. [프론트엔드 아키텍처](frontend-architecture.md)의 기능별 구성을 따릅니다.

| 책임 | 제안 위치·수명 |
| --- | --- |
| HTTP·저장소 공통 처리 | 필요 시 `src/lib/`. 전송과 오류 변환 담당, 제품 흐름에 직접 의존하지 않음 |
| 각 기능의 요청·응답 모델 | 해당 `src/features/<기능>/api/`. mock과 실제 응답을 같은 화면 모델로 변환 |
| 로그인·동의·1회성 복귀 의도 | 인증 흐름의 소유 상태. 완료·취소 후 정리하고 라우트 조합에서 기능 연결 |
| 본문·커서·초안 | 글쓰기 기능 소유. 계정별 저장, 정책이 허용한 시점에만 삭제 |
| 미확정 요청 식별자 | 해당 기능 소유. 앱 종료 후 조회에 필요한 보관 방식은 구현 전에 확정 |
| 목록 캐시 | 서버 상태로 관리. 계정 경계와 변경 성공의 무효화 규칙 적용 |

여러 기능이 사용하는 복귀 의도·사용자 모델의 실제 공유 경로는 사용처가 생길 때 정합니다. 이를 위해 모든 연산에 Repository·UseCase 계층을 만들지는 않습니다. 성능 목표는 자료에 수치가 없어 새로 확정하지 않습니다.

| 플랫폼 | 반영할 차이 | 검증 상태 |
| --- | --- | --- |
| 웹 | 브라우저 초안·시뮬레이션·소리 상태, history·포커스·클립보드, Push 지원 | 미실행 |
| Android | 공통 계약 유지. 네이티브 저장·뒤로·인증 복귀·Push 대응 미정 | 미실행 |
| iOS | 공통 계약 유지. 네이티브 저장·인증 복귀·Push 대응 미정 | 미실행 |

## 4. 완료 조건과 검증

| ID | 조건·기대 결과 | 검증 방법 | 결과 |
| --- | --- | --- | --- |
| CONTRACT-AC-01 | 조회 중·빈 목록·오류·인증 필요 상태를 서로 구별 | 응답 fixture와 화면 검수, QA-13–18 | 미실행 |
| CONTRACT-AC-02 | 로그인 취소·늦은 콜백·동의 실패 후 보호 액션 없음, 성공 시 원래 대상 복귀 | 인증 adapter와 시나리오 검증, QA-10–15 | 미실행 |
| CONTRACT-AC-03 | 중복 제출·15초 지연·성공 응답 유실·앱 복귀에도 같은 글 한 건 | 서버 멱등성 및 클라이언트 복구 검증, QA-07–09 | 미실행 |
| CONTRACT-AC-04 | 계정 변경·로그아웃·탈퇴 후 이전 개인 데이터 미노출 | 저장소·캐시·내비게이션 검수, QA-25–27 | 미실행 |
| CONTRACT-AC-05 | 이모지·한글 조합·줄바꿈의 문자 수와 요약이 서버/클라이언트에서 동일 | 공통 경계값 fixture, QA-04–06 | 미실행 |
| CONTRACT-AC-06 | UI 오류와 서버 기록을 `requestId`로 연결하되 토큰·원문 오류·개인정보 미노출 | 오류 응답·로그 검수 | 미실행 |

제품 API·화면을 실행하지 않았습니다. 문서 대조 결과는 [제품 범위](product-overview.md), 향후 실행 증빙은 [QA 양식](../policy/launch-operations.md)에 기록합니다.

## 5. 미결정 사항

| 질문 | 확인할 대상과 영향 | 구현 차단 여부 |
| --- | --- | --- |
| 실제 endpoint·인증 방식·세션 갱신·필드 타입·error JSON·커서·retryAfter 단위 | 서버 담당. 현재는 논리 계약만 존재 | mock 가능, 실제 연동 전 확정 |
| `UNKNOWN`에서 미등록 확정 조건, 조회 주기·수명, 탈퇴 응답 유실 처리 | 서버·프론트엔드. 중복 생성·완료 오판 방지 | 등록·탈퇴의 실제 연동 전 확정 |
| 공감·신고·숨김·차단·로그아웃의 응답 유실 조회 방식 | 상태 조회 API가 원문에 없음 | 해당 변경 요청의 복구 구현 전 확정 |
| 게스트·계정 숨김 합집합 병합과 숨김 목록 조회 | `07.05-F1`에 병합 정책은 있으나 `00-B`에 요청·조회·실패 복구 계약이 없음 | 로그인 후 숨김 병합의 실제 연동 전 확정 |
| 사용자 인식 문자 분할 라이브러리·알고리즘 버전 | 서버·프론트엔드. 동일 검증 보장 | 공통 입력 검증 전 확정 |
| 복귀 의도의 수명·계정 전환 처리, 민감 초안의 저장 방식 | 프론트엔드·서비스 운영 | 영속 저장 구현 전 확정 |
| 게시글 외 `FORBIDDEN/NOT_FOUND/UNAVAILABLE` 처리 | 공통 규칙은 모두 `07.09`로 명시 | 해당 연산 오류 화면 설계 전 확인 |
| 브라우저 중심 정책의 네이티브 저장·Push 대응 | 앱 확장 담당 | 웹 mock과 문서 작업은 진행 가능 |

## 6. 결정·변경 기록

| 날짜 | 변경 내용과 이유 | 근거 | 영향 |
| --- | --- | --- | --- |
| 2026-10-21 | 공통 논리 계약·오류·복귀를 한 스펙으로 정리 | 00-A·00-B·00-C | 기능 스펙에서 참조. 실제 서버 합의·구현 완료와 구분 |
