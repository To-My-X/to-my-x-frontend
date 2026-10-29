# 인수인계

## 카카오 앱 로그인 서버 반영 확인·실패 진단 — 2026-10-30

- 서버가 ID 토큰 허용 audience에 네이티브 앱 키를 추가한 뒤, iOS 시뮬레이터에서 카카오 간편로그인 → 서버 교환 → 동의(08.06) 진입까지 실서버 왕복을 확인했습니다. 상세는 [계정 스펙](../specs/account-access.md)의 2026-10-30 기록을 따릅니다.
- Android 실기기(Play 내부 테스트 versionCode 7) 로그인 실패 보고는 audience 수정 이전 테스트로 추정되어 사용자 재시도 대기 중입니다. 재시도에도 실패하면 원인을 현장에서 읽을 수 있도록 실패 시트(08.05)에 에러 메시지를 표시하는 디버그 표시(mock 로그인과 같은 활성 조건, production 제외)를 추가해 testing OTA로 전달합니다.
- 로컬 Android 에뮬레이터 검증은 Pixel_10_Pro_Fold AVD의 에뮬레이터 프로세스 크래시(segfault)로 중단했습니다. 로컬 `android/`가 카카오 maven 저장소 반영 전 상태라 Gradle이 실패했고 `expo prebuild -p android --clean`으로 해결했습니다(CNG라 커밋 대상 아님).

## 현재 작업

- 갱신일: 2026-10-22
- 목적: 서버 구현 전, 레이아웃과 화면 이동 중심의 전체 화면 연결 골격 구축
- 단계: 59개 화면의 연결 골격 구현 완료. 1차(글쓰기·로그인·동의)와 2차(온보딩·알림·MY·상세·관리 시트·설정·등록 결과)로 커밋을 분리해 develop에 푸시했고, PR #2를 merge commit으로 main에 반영한 뒤 main을 develop에 되병합했습니다.
- 브랜치: develop. main 반영에 따라 웹 프로덕션 배포와 앱 테스트 자동화(새 바이너리 빌드·내부 테스트 제출 예상)가 실행 중이며 결과 확인이 남아 있습니다.
- 시작 문서: [제품 명세 총괄과 화면 지도](../specs/product-overview.md)의 7장 화면 연결 골격
- 입력 자료: [PDF 76개 목록·원문 추출·디자인 미리보기](../references/tomyx-2026-10-20/README.md). 현재 화면 59개와 LEGACY 1개를 구분했습니다.

## 카카오 로그인 실연동 — 2026-10-28

- 서버 Auth API(카카오 웹 코드 로그인·토큰 재발급·로그아웃)를 연동하고 mock-session을 실세션 AuthProvider(auth-session.tsx)로 교체했습니다. 상세와 redirect URI 등록 목록은 [계정 스펙](../specs/account-access.md)의 2026-10-28 기록을 따릅니다.
- 카카오 REST API 키를 .env.local, EAS preview·production 환경, GitHub Actions 변수에 등록했습니다. 네이티브 앱 키는 app.json config plugin과 EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY(.env.local, EAS preview·production)에 등록했습니다.
- 네이티브 카카오 SDK(@react-native-kakao v2.4)를 추가해 앱 로그인(ID 토큰)을 연결했습니다. 네이티브 모듈 추가로 다음 main 머지는 새 바이너리 빌드·스토어 제출로 배포됩니다. 카카오 콘솔에 Android 패키지·키 해시, iOS 번들 ID 등록이 필요합니다(계정 스펙의 등록값 참조).
- 검증: lint·타입·단위 테스트 17개 통과(인증 3개 포함). 로컬 웹에서 카카오 계정 페이지 진입까지 확인했으나 인가 단계에서 KOE006 발생 — redirect URI 3종(localhost·develop·prod /login)의 카카오 콘솔 등록을 서버 담당자에게 요청한 상태입니다. 등록 후 실계정 로그인 왕복을 확인합니다.

## 온보딩 시안 1:1 대조 보정 — 2026-10-27

- 사용자가 제공한 15장 시안 이미지와 화면 단위로 대조해 보정했습니다: CTA를 좌우 꽉 찬 알약형(주=크림 채움·보조=어두운 채움)으로, 친구 128 아래 여백, 친구 목록의 빈 아바타 자리·하이라이트 제거·"업데이트한 프로필", 02.05 다시 친구 목록의 패널 제거(B·여운 전 장면 패널 없음으로 통일), 인스타 02.07 그리드 3장화 + 새 게시물 칸이 벌어지며 추가되는 width 애니메이션, 자니 대화방(마지막 대화 라벨·회색 말풍선·이모지)과 보내기 직전(내 말풍선 하나·회색 전송 버튼) 재구성, 여운 장면 레이아웃(서사 상단 1/3·프롬프트 하단 고정)과 서사 문구 5곳 교정.
- ActionButton의 bright 변형은 온보딩 전용 CtaButton으로 대체하고 제거했습니다.
- 검증: lint·타입 통과. Chromium 375×812에서 카톡 진입, 인스타 프로필(2장→3장 애니 전후 캡처), 자니 대화·보내기 직전·여운을 시안과 대조 확인, 깨끗한 로드 콘솔 오류 0건.

## 온보딩 시안 재현·실사진 적용 — 2026-10-26

- 사용자 피드백에 따라 온보딩을 디자인 시안(2-02) 그대로 재현했습니다: 화면 내 뒤로 버튼 제거(시스템 뒤로만 직전 장면 복원, beforeRemove 처리), 카톡·인스타·자니 상황 패널을 실제 앱 캡쳐 느낌으로 재구성, PDF 임베디드 원본 사진 3종(assets/images/onboarding/)을 최종 사용자 이미지로 채택. 상세는 [온보딩 스펙](../specs/onboarding-simulation.md)의 2026-10-26 기록과 [디자인 시스템](../specs/design-system.md) 자산 표를 따릅니다.
- ActionButton에 bright(밝은 채움) 변형을 추가해 시안의 주 CTA 스타일을 적용했습니다.
- 검증: lint·타입·단위 테스트 통과. Chromium 375×812에서 카톡 3장면(사진 포함)·인스타 검색/프로필·자니 목록/대화/키보드와 완료 후 피드 유지 확인. 깨끗한 페이지 로드 기준 콘솔 오류 0건(누적 로그의 오류는 전부 작업 중 HMR 스택). 네이티브 실행은 미검증.

## 온보딩 첫 방문 자동 배정·진행 저장 — 2026-10-26

- 피드 진입 시 이력이 없거나 미완료면 `/onboarding`으로 보내고, 저장된 에피소드·장면을 복원합니다(재배정 금지). 완료 기준·저장 키·실패 처리 채택값은 [온보딩 스펙](../specs/onboarding-simulation.md)의 2026-10-26(진행 저장) 기록을 따릅니다.
- 웹 localStorage 보존, 네이티브는 세션 메모리 폴백(앱 재시작 시 새 배정). 네이티브 영구 저장은 OPEN-05 확정 후 저장 모듈과 함께 결정합니다.
- 검증: lint·타입·단위 테스트 14개(진행 저장 왕복·손상값 거부·뒤로 경로 포함) 통과. Chromium 375×812에서 첫 방문 리다이렉트→배정 저장, 장면 진행 후 리로드 복원(같은 에피소드·장면), 첫 장면 뒤로 이탈→피드 유지(done 기록)를 확인했고 깨끗한 페이지 로드 기준 콘솔 오류 0건(Fast Refresh 중 1회성 스택은 실사용 미재현).

## 온보딩 시뮬레이션 연출 구현 — 2026-10-26

- 사용자 요청으로 02.01~02.15 전 장면에 연출용 상황 카드(카톡 친구 목록·프로필, 인스타 검색·계정·게시물, 자니 채팅 목록·대화방·꺼진 화면)와 페이드 진입 모션(RN Animated timing 스태거, 검색 타이핑 연출)을 구현했습니다. 상세는 [온보딩 스펙](../specs/onboarding-simulation.md)의 2026-10-26 기록을 따릅니다.
- 검수: 개발 환경 `/onboarding?episode=kakao|insta|jani`. Chromium 375×812에서 카톡 진입·선택·B, 인스타 진입·선택, 자니 전 장면과 여운→로그인 진입을 확인했고 콘솔 오류 0건, lint·타입·전이 그래프 테스트 통과. 네이티브 실행·실기기 검증과 A경로 일부(카톡 02.03, 인스타 02.08~10) 수동 클릭은 미실행이나 동일 컴포넌트·전이 로직입니다.
- 배정 저장·진행 복원·리소스 상태는 계속 미구현(저장 설계 확정 대기)입니다.

## 내부 테스트 mock 로그인·시트 수정 — 2026-10-22

- 내부 테스트 빌드에 mock 로그인이 없다는 사용자 보고에 따라 활성 조건을 `__DEV__ || EXPO_PUBLIC_MOCK_AUTH=1`로 확장했습니다. 플래그는 EAS preview 환경에 등록(`eas env`)해 testing 빌드·OTA에만 주입되고 production 환경에는 없습니다.
- 네이티브에서 바텀시트가 웹과 다르게 보이는 문제는 RN Modal 안에서 reanimated 진입 애니메이션이 실행되지 않는 제약이 원인이라 BottomSheet를 Modal 대신 화면 위 오버레이로 변경했습니다. 하드웨어 뒤로 가기 닫기는 미연결입니다.
- iOS 시뮬레이터 검증 중 Hermes에 없는 `Intl.Segmenter` 사용으로 네이티브가 시작 시 크래시하는 문제를 발견해 코드 포인트 폴백으로 수정했습니다(실수 기록 참조). 10-21 바이너리에 d7fdafb OTA가 적용되면 크래시했을 상태였습니다.
- 검증: 시뮬레이터(iPhone 18 Pro)에서 피드 스와이프 스냅·스크롤 후 컨트롤 숨김·공유/로그인 시트·mock 로그인→동의→편집 카운터 렌더 확인. lint·타입·단위 테스트 통과.
- 폰 반영은 다음 main 머지의 testing OTA로 전달됩니다. 단, 폰에는 10-21 제출 바이너리(iOS b47e7383, Android versionCode 6)가 설치돼 있어야 OTA를 받습니다. 이전 10-19 빌드는 runtime이 달라 OTA 대상이 아닙니다.

## 피드 페이징·모션 — 2026-10-22

- 사용자 결정으로 피드를 페이지 스냅(한 스와이프 = 한 이야기)으로 변경하고, FlowPage 진입 페이드·시트 슬라이드(reanimated)·네이티브 스택 slide_from_right 전환을 추가했습니다. 근거와 세부는 [디자인 시스템](../specs/design-system.md) 7장과 [피드 스펙](../specs/story-feed.md)의 2026-10-22 기록을 따릅니다.
- 검증: lint·타입·단위 테스트 8개 통과. Chromium 375×812에서 스냅 위치·원위치 복귀·긴 글 내부 스크롤·시트 표시를 확인, 콘솔 오류 0건. 네이티브 전환·실기기 스와이프·reduce motion 대응은 미검증입니다.

## 화면 연결 골격 — 2026-10-22

- 전 화면을 mock으로 연결했습니다. 상세 범위와 미구현 항목은 각 스펙의 "화면 연결" 기록을 따릅니다: [총괄 7장](../specs/product-overview.md), [글쓰기](../specs/story-writing.md), [계정](../specs/account-access.md), [피드·관리](../specs/story-feed.md), [온보딩](../specs/onboarding-simulation.md).
- 로그인·동의는 `?next=<허용 키>`로 진입 의도를 복귀합니다. mock 세션은 메모리 전용이라 새로고침·직접 URL 진입 시 게스트로 초기화됩니다.
- 검증: lint·타입·단위 테스트 3개(body-rules 2, 온보딩 전이 그래프 1) 통과. 개발 웹 서버(Chromium 375×812)에서 알림·MY·상세·공유/관리 시트·설정·로그아웃·법적 문서·온보딩 A/B·글쓰기 등록 완료 흐름을 클릭으로 확인, 콘솔 오류 0건. Playwright 미설치로 flow-web E2E는 미실행. 네이티브·실기기·웹 export는 미검증.
- 다음 후보: 공감·08.04/05 로그인 진행/실패 상태, 온보딩 진행 저장·첫 방문 분기, 실제 API 계약(OPEN-01)과 디자인 토큰 확정(OPEN-02) 대기 항목.

## Mock 피드 구현 — 2026-10-21

- 루트에서 04.01~04.04 mock 피드 진입. 개발 서버의 `/feed-preview`에서 로딩·빈 상태·오류·추가 오류·긴 글을 확인합니다. 실제 API, 공감·공유·쓰기·인증·영상·음원은 연결하지 않았습니다.
- Chromium 폭 320/375/430/1280, 스크롤 81px/상향 8px, + 좌표 동일, 재시도와 기존 목록 유지, 긴 글·확대 확인. 콘솔 오류 0건. [캡처](../references/feed-mock-2026-10-21/README.md).
- 다음 작업: 디자이너에게 임시 토큰·배경 사용 권한·스크롤 후 컨트롤을 확인하고 실제 피드 API 계약 또는 글쓰기/인증 중 다음 구현 범위를 정합니다. Android·iOS와 실제 모바일 Safari 검증은 별도입니다.

## 다음 제품 작업

- 총괄의 OPEN 목록과 담당 기능 스펙을 확인한 뒤 구현 범위를 정합니다. 전달 자료의 확정 UI·채택 기본값, 구현 제안·실제 서버 미확인을 구분했습니다.
- 정확한 디자인 토큰·사용 가능한 폰트/이미지/로고, 운영 약관·문의 주소·인증 공급자 설정, 실제 API와 중복 방지·결과 조회 계약이 필요합니다.
- 04.02 컨트롤 표시·+ 크기/위치와 정책의 차이, 04.04 + 동작, 결과 불명·저장 실패 UI를 확인합니다. 공개 확인 중 세션 만료는 재인증 후 03.04로 돌아와 다시 승인받는 규칙을 계정·글쓰기 스펙에 맞췄습니다.
- 영상·릴스 광고와 네이티브 저장·Push 세부 정책은 이번 자료에 충분히 정의되지 않았습니다. 포함 여부와 동작을 확정한 뒤 해당 스펙을 보완합니다.
- 필수 운영값 검사·공개 배포 차단은 요구사항으로 기록했으며 CI 구현은 아직 없습니다. 기존 배포 자동화와 최종 계정·식별자 점검은 유지합니다.

## 문서 정리 검증 — 2026-10-21

- 정책·개발명세 PDF 67개와 디자인 PDF 9개에서 전 페이지 텍스트를 추출했습니다. 디자인 9개는 렌더 이미지도 검토해 저장소에 보관했습니다. 59개 현행 화면과 LEGACY 1개의 출처·반영 위치·SHA-256을 기록했습니다.
- 기능 스펙을 원문과 교차 검토했고 공개 확인 재인증 복귀를 보완했습니다. 문서 34개의 로컬 링크·앵커 419개, 원문 스냅샷 76개 대응, Markdown 후행 공백 검사와 git diff --check를 통과했습니다.
- npm run lint와 npm run typecheck를 통과했습니다. 앱 코드·API·배포 설정은 변경하지 않았고, 빌드·제품 기능 QA·커밋·푸시는 실행하지 않았습니다.
- 이전 작업의 정식 출시 전 계정·식별자 점검 문서 변경은 유지했습니다. 실제 계정·식별자·서명·자동화 태그는 변경하지 않았습니다.

## 이전 배포 기반 — 2026-10-19

main의 앱 영향·fingerprint 판정과 테스트 배포 자동화를 검증했습니다. PR #1의 main merge commit을 develop에도 반영했습니다. 상세 기준은 [앱 테스트 자동화](../specs/app-test-automation.md)와 [빌드·배포](../specs/build-deploy.md)를 따릅니다.

## 확정 사항

- 웹은 develop 테스트·main 프로덕션 자동 배포를 유지합니다. develop 웹 배포는 기존 Actions 38521762369에서 확인했습니다.
- 앱은 main에서만 테스트까지 자동화합니다. APP_TEST_ENABLED=true가 활성화 조건입니다.
- 마지막 성공한 플랫폼별 배포와 비교해 앱 영향이 없으면 생략합니다. fingerprint가 같으면 testing OTA, 다르면 testing 빌드·Play 내부 테스트·TestFlight 제출입니다.
- 프로덕션 앱·OTA는 사람이 app-release로 요청합니다. testing 채널의 바이너리를 그대로 공개하지 않습니다.

## 배포 기반 변경과 검증

- expo-updates와 fingerprint runtime 정책·업데이트 URL·채널을 구성했습니다.
- 자동화 스크립트는 전용 상태 태그의 success·pending을 구분해 성공 기준과 제출 대기 빌드 ID를 보존합니다.
- 앱 영향 판정·OTA·실패 복구 등 5개 Node 테스트가 통과했습니다. lint·타입·웹 빌드와 워크플로 구문·문서 링크 80개도 통과했습니다.
- Actions 39209084419에서 웹 배포와 Android·iOS 신규 testing 빌드·스토어 제출이 모두 성공했습니다. OTA 자동 분기는 아직 실검증하지 않았습니다.

## 직접 준비할 항목

- EAS 토큰의 Build·Update·Submit 권한과 preview·production 환경을 확인합니다.
- Android Play 제출용 서비스 계정과 iOS API key·서명·ascAppId 연결 및 실제 자동 제출을 확인했습니다.
- TestFlight 그룹과 테스터, Play 내부 테스터를 설정합니다. 이전 OTA 미설정 앱은 최초 테스트 바이너리 설치가 필요합니다.
- APP_TEST_ENABLED=true로 활성화했고 두 플랫폼 성공 기준 태그 쓰기도 실제 성공했습니다.
- 상세 순서와 수동 프로덕션 전환은 앱 테스트 명세를 따릅니다. 다음 공통 코드 변경에서는 OTA 자동 분기와 설치 앱 반영을 검증합니다.

## Android 로컬 빌드 진단 — 2026-10-15

- 사용자 로그의 40초 실패는 daemon-17039 로그와 일치하며 원인은 ANDROID_HOME 미설정에 따른 SDK location not found입니다. SDK 자체는 설치돼 있었습니다.
- 이 PC의 .env.local에 검증한 SDK 경로를 기록했고 Expo 환경 로더로 로딩을 확인했습니다. 해당 파일은 Git 제외 상태입니다.
- SDK·Node 경로를 명시한 재실행에서 SDK 탐색과 NDK 27.1.12297006·27.0.12077973 설치를 완료했습니다. 이후 mergeExtDexDebug의 Gradle 캐시 저장 중 classes3.dex 파일 모드 조회 실패로 종료됐습니다. APK 성공은 미확인이고 현재는 iOS 시작 오류를 우선 처리합니다.
- lint·타입 검사는 통과했습니다. [로컬 개발 안내](../setup/android-local.md)에 SDK·Node·NDK 준비 방법을 기록했습니다.

## iOS 시작 실패 진단 — 2026-10-15

- Xcode 27.0·iOS 27 시뮬레이터에서 Scene 생명주기 누락으로 시작이 거부됐습니다. 기존 생성 프로젝트는 UIApplicationSceneManifest 없이 AppDelegate에서 window를 만들었습니다.
- SDK 57 공식 지침에 따라 expo-build-properties의 ios.enableSceneSupport를 활성화하고 Expo prebuild로 iOS를 재생성했습니다. Scene manifest와 factory provider 채택·이전 startup 코드 제거를 확인했습니다.
- iOS 재빌드 성공(0 errors), iPhone 18 Pro·iOS 27 시뮬레이터 설치·실행과 실행 프로세스를 확인했습니다. Scene 오류에 따른 즉시 종료가 해소됐습니다. lint·타입 검사·문서 링크 84개 검사도 통과했습니다. 기능 전체 검증이나 스토어 빌드는 실행하지 않았습니다. [iOS 개발 안내](../setup/ios-local.md)를 참조합니다.

## EAS Android production 실패 — 2026-10-15

- 빌드 6e0f0b4e-c350-4b56-a890-5403a521e72b는 Configure expo-updates에서 로컬·클라우드 runtime fingerprint 불일치로 실패했습니다. 환경변수 없음 안내가 직접 원인은 아닙니다.
- 동일 버전 npm 원본을 임시 폴더에 받아 비교했고, 4개 의존성의 원본 해시가 EAS 로그의 해시와 정확히 일치했습니다. 로컬 masked-view AndroidManifest에서 package 속성이 제거됐고 나머지 패키지에는 wrapper·SDK 경로 파일이 추가돼 있었습니다.
- npm ci로 원본 의존성 복원, .fingerprintignore에서 머신별 local.properties만 제외했습니다. 원본 4개 의존성의 해시 일치, SDK 경로 제외·Manifest 변경 감지, lint·타입 검사를 통과했습니다. 사용자 목적이 첫 내부 테스트 수동 업로드임을 확인해 testing 프로필로 dd216c2f-a799-4ec6-8e75-3396929fae61 빌드가 FINISHED로 성공했고 testing 채널·AAB 생성을 확인했습니다. 에이전트는 제출하지 않았으며, 사용자가 Android 내부 테스트 수동 출시 완료를 확인했습니다.

## main 앱 테스트 자동화 실검증 준비 — 2026-10-19

- 사용자가 Android·iOS 수동 내부 테스트 빌드·배포 완료를 확인했고 main 병합 후 새 빌드·자동 제출 검증을 요청했습니다. iOS ascAppId 6824389886을 반영합니다.
- GitHub APP_TEST_ENABLED 변수와 플랫폼 성공 기준 태그는 없는 상태입니다. 최초 실행은 새 바이너리를 빌드합니다.
- EAS Android 서명은 준비됐지만 Play 제출용 Google 서비스 계정은 None assigned yet입니다. 연결 전에는 자동화를 활성화하지 않습니다. iOS는 EAS에 App Store Connect API Key와 유효한 배포 인증서·프로비저닝이 연결돼 있음을 확인했습니다.
- lint·타입 검사와 자동화 테스트 5개 통과. 자격증명 확인 후 develop → main PR을 merge commit으로 반영하고 실행 결과를 기록합니다.

## 자동화 활성화 — 2026-10-19

- 사용자의 Google 서비스 계정 연결 완료 후 진행 요청에 따라 EAS의 Android Play 제출용 키 연결을 확인했습니다. iOS API 키와 서명은 앞서 확인했습니다.
- PR #1의 check·web 검사는 통과했습니다. 문서 동기화 리뷰에서 오래된 Android 미연결 상태를 보완했습니다. APP_TEST_ENABLED=true 설정 후 merge commit으로 main에 반영해 최초 테스트 빌드·제출을 검증합니다.
- 공개 앱 출시는 실행하지 않습니다. main 병합에 따라 웹 프로덕션 배포도 실행됩니다. 실제 CI 결과는 후속 기록합니다.

## main 자동 배포 실행 — 2026-10-19

- APP_TEST_ENABLED=true 활성화, PR #1 merge commit 13179dbc198779367a8cf880411b88fccd51818d로 main 반영. 해당 이력을 develop에도 반영·푸시했습니다.
- Actions 실행: https://github.com/To-My-X/to-my-x-frontend/actions/runs/39209084419 . check 성공, 웹 배포와 앱 테스트 작업 진행 중입니다.
- CI가 생성한 testing 빌드: Android 23d1ce55-34d3-4b7d-aec9-93f9b2dcb3b7, iOS a514910f-90c4-412d-a731-343132a0b65b. 두 빌드 모두 main 병합 SHA를 사용함을 확인했습니다. 최종 빌드·제출 결과는 아직 대기 중입니다.

- 중간 결과: 웹 프로덕션 배포와 iOS app-test 작업 성공. iOS testing 빌드 a514910f-90c4-412d-a731-343132a0b65b FINISHED 및 CI의 제출 완료를 확인했고 app-test-ios 태그가 저장됐습니다. Android는 네이티브 CMake 컴파일 중입니다.

## 자동화 최종 결과 — 2026-10-19

- Actions 39209084419 전체 success: check·web·app-test (android)·app-test (ios) 모두 성공했습니다.
- 소스 SHA: 13179dbc198779367a8cf880411b88fccd51818d. Android 빌드 23d1ce55-34d3-4b7d-aec9-93f9b2dcb3b7 → 내부 테스트 제출 58db4cac-b651-414d-a39c-4c73858f213b 성공. iOS 빌드 a514910f-90c4-412d-a731-343132a0b65b → TestFlight 제출 498c8c2e-518d-47e8-8563-155ccf26dcbc 성공.
- 두 플랫폼 모두 build-submit 분기로 실행됐고 app-test 태그의 success SHA·fingerprint·buildId와 pending=null을 확인했습니다.
- 이번 새 버전의 스토어 처리 완료·테스터 설치·실행은 직접 확인하지 않았습니다. 공개 앱 출시와 production OTA는 실행하지 않았습니다. 다음 공통 코드 변경에서는 testing OTA 분기와 설치 앱 반영을 별도로 검증합니다.

## 프론트엔드 설계 확정 — 2026-10-20

- 사용자가 기능별 구조와 UI·데이터 분리를 채택했습니다. 설계 원본은 [프론트엔드 아키텍처](../specs/frontend-architecture.md)이며 AGENTS.md에서 구현 전 읽고 따르도록 연결했습니다.
- 새 제품 기능부터 적용합니다. 현재 Expo 템플릿 화면과 hooks·constants 등은 유지하며, 관련 제품 기능 구현 시 전환합니다. 코드 이동·새 의존성·import 경계 자동 검사는 이번 작업에 포함하지 않습니다.
- 사용자 확인상 Android·iOS 내부 테스트 배포를 직접 확인했습니다. OTA 자동 분기는 여전히 별도 검증 대상입니다.
- npm run lint·npm run typecheck 통과, AGENTS.md와 docs의 로컬 문서 링크 88개 및 git diff --check 통과. 문서만 변경했으며 앱 동작·빌드 검증은 실행하지 않았습니다.

## 최종 배포 대상 확정 대기 — 2026-10-20

- 현재 계정과 기존 앱으로 내부 테스트를 계속합니다. 최종 이름·배포 계정과 Android·iOS 식별자 유지·변경은 정식 출시 전에 확정합니다. 지금 계정·식별자·인증·자동화 태그는 변경하지 않습니다.
- 빌드와 배포 명세에 공개 출시 전 점검을 기록하고 app-release에서 반드시 수행하도록 연결했습니다. 식별자 변경 시 스토어 신규 등록·인증 연결·자동화 성공 기준 재설정과 새 바이너리 설치 검증이 필요합니다.
