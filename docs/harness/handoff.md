# 인수인계

## 현재 작업

- 갱신일: 2026-10-19
- 목적: main의 앱 영향·fingerprint 판정과 테스트 배포 자동화
- 단계: main 병합 후 웹 프로덕션·Android 내부 테스트·iOS TestFlight 자동 빌드와 제출 성공
- 브랜치: develop. PR #1을 main에 merge commit으로 병합했고 develop에도 해당 이력을 반영했습니다.
- 관련 문서: [앱 테스트 자동화](../specs/app-test-automation.md), [빌드·배포](../specs/build-deploy.md)

## 확정 사항

- 웹은 develop 테스트·main 프로덕션 자동 배포를 유지합니다. develop 웹 배포는 기존 Actions 38521762369에서 확인했습니다.
- 앱은 main에서만 테스트까지 자동화합니다. APP_TEST_ENABLED=true가 활성화 조건입니다.
- 마지막 성공한 플랫폼별 배포와 비교해 앱 영향이 없으면 생략합니다. fingerprint가 같으면 testing OTA, 다르면 testing 빌드·Play 내부 테스트·TestFlight 제출입니다.
- 프로덕션 앱·OTA는 사람이 app-release로 요청합니다. testing 채널의 바이너리를 그대로 공개하지 않습니다.

## 이번 변경과 검증

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
