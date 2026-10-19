# 인수인계

## 현재 작업

- 갱신일: 2026-10-15
- 목적: main의 앱 영향·fingerprint 판정과 테스트 배포 자동화
- 단계: 로컬 자동화 검증 완료, Android testing 빌드 성공·수동 내부 테스트 출시 완료, iOS 준비 대기
- 브랜치: develop. 이번 변경은 목적별 커밋으로 정리합니다. 원격 푸시와 main 반영은 별도 진행합니다.
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
- Android EAS testing 빌드와 fingerprint 설정 단계는 통과했습니다. 자동화 워크플로의 OTA·스토어 제출은 아직 검증하지 않았습니다.

## 직접 준비할 항목

- EAS 토큰의 Build·Update·Submit 권한과 preview·production 환경을 확인합니다.
- 사용자 확인상 Android 첫 내부 테스트 수동 출시는 완료했습니다. Play 자동 제출 서비스 계정 설정은 별도 확인합니다. Apple 멤버십은 갱신했으며 반영 대기 중입니다. iOS 앱 등록·서명·API key·숫자 ascAppId와 TestFlight는 나중에 준비합니다.
- TestFlight 그룹과 테스터, Play 내부 테스터를 설정합니다. 이전 OTA 미설정 앱은 최초 테스트 바이너리 설치가 필요합니다.
- 준비 후 GitHub 변수 APP_TEST_ENABLED=true를 등록하고 전용 상태 태그 두 개의 쓰기를 허용합니다.
- 상세 순서와 수동 프로덕션 전환은 앱 테스트 명세를 따릅니다. 커밋·main 반영·실제 배포는 별도 검증해야 합니다.

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
