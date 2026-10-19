# 앱 테스트 배포 자동화

- 유형: 배포 흐름·기술 설계
- 명세 상태: 확정
- 구현 상태: 로컬 구성 완료, 계정 설정과 실제 실행 대기
- 갱신일: 2026-10-15
- 확정 근거: main 반영 후 앱 업데이트 필요 여부를 판정하고 테스트 배포까지 자동화합니다. 앱 프로덕션 반영은 사람이 요청해 진행합니다.
- 관련 문서: [웹·앱 배포](build-deploy.md), [앱 릴리스 스킬](../skills/app-release/SKILL.md)

## 목적과 범위 — PRD

웹 배포는 기존대로 develop은 테스트, main은 프로덕션으로 유지합니다. 앱은 main에서만 자동 테스트 배포합니다. develop의 모든 개발 커밋마다 앱을 빌드하지 않습니다. `APP_TEST_ENABLED=true`를 등록하기 전에는 앱 작업을 실행하지 않습니다.

| 판정 | 자동 실행 |
| --- | --- |
| 이전 성공 이후 앱 영향 없음 | 앱 작업 생략 |
| 앱 영향 있음, native fingerprint 동일 | testing 채널 OTA 배포 |
| 성공 기준 없음 또는 fingerprint 변경 | testing 프로필 빌드 후 Play 내부 테스트·TestFlight 제출 |

판정은 보수적입니다. 문서·웹 전용 플랫폼 파일 등 명확한 제외 대상만 생략하며, 공통 코드·설정·알 수 없는 파일은 앱 영향으로 취급합니다. 사용하지 않는 코드나 네이티브와 무관한 설정 변경으로도 불필요한 배포가 발생할 수 있습니다. 사람이 판단하는 제품 출시 필요성을 완전히 대신하지 않습니다.

## 흐름과 상태 — IA

`main push → lint·타입 검사 → Android·iOS별 성공 기준 조회 → 변경 범위 비교 → fingerprint → OTA 또는 빌드·테스트 제출 → 성공 기준 갱신`

- PR에서는 앱 작업을 실행하지 않습니다. 두 플랫폼은 독립 실행하며 서로의 실패로 취소하지 않습니다.
- 직전 커밋 대신 마지막 성공한 플랫폼별 테스트 배포 SHA와 비교합니다. 중간 실패·배포 생략·삭제 파일을 포함합니다.
- 성공 기록이 없는 최초 실행은 테스트 바이너리를 생성합니다. 기존 OTA 미설정 앱에 업데이트를 억지로 보내지 않습니다.
- 제출 실패 시 성공 SHA는 유지하고 제출 대기 빌드 ID를 별도 기록합니다. 같은 SHA를 재실행하면 그 ID로 제출을 재시도합니다.
- 빌드 대기 중 취소되면 완성된 ID를 저장하지 못할 수 있습니다. 원격 작업·네트워크 응답이 불명확하면 EAS에서 확인하고 재실행합니다. 상태 저장 실패 후 무조건 재실행하면 중복 OTA·제출이 발생할 수 있습니다.

## 기술 설계 — Tech Spec

- `.github/workflows/build-deploy.yml`의 `app-test` 작업은 main·수동 main 실행에서만 동작합니다. 같은 main 워크플로를 직렬화하며, 대기 중 실행은 GitHub concurrency 특성상 대체될 수 있습니다.
- `scripts/app-test-release.mjs`에서 변경 범위·fingerprint·EAS 실행·결과 기록을 처리합니다.
- 상태는 전용 annotated tag `app-test-android`, `app-test-ios`의 JSON 메시지에 보관합니다. success에는 SHA·fingerprint·buildId, pending에는 제출 대기 빌드 정보를 기록합니다. OTA 결과도 성공 기록에 보관합니다.
- 이 태그는 릴리스 버전 태그가 아닌 자동화 상태입니다. 해당 태그만 force-with-lease로 갱신하며 브랜치는 수정하지 않습니다. 다른 실행이 상태를 변경하면 push가 실패하도록 합니다. Actions의 contents:write 권한과 이 두 태그에 대한 쓰기 허용이 필요합니다. 임의 삭제하면 다음 실행은 최초 빌드로 처리됩니다.
- 기준 SHA가 현재 HEAD의 조상이 아니거나 상태 JSON이 손상되면 중단합니다. 원격 조회 오류를 최초 실행으로 오인하지 않습니다.
- `runtimeVersion.policy=fingerprint`, EAS Update URL과 expo-updates를 설정했습니다. `testing`은 preview 환경·testing 채널의 스토어 빌드이며, 제출 프로필은 production의 내부 테스트 설정을 상속합니다. 테스트 프로필에서 공개 track을 덮어쓰지 않습니다.
- `production`은 production 환경·production 채널입니다. 자동 작업은 해당 채널에 publish하거나 공개 스토어 track에 제출하지 않습니다.
- runtime fingerprint는 호환성 판단이며 기능 정상 동작을 보장하지 않습니다. 새 환경변수·플러그인·외부 네이티브 설정을 추가할 때 fingerprint에 반영되는지 확인합니다. 환경변수만 바꾸고 Git 코드가 그대로인 경우 이 작업은 변화를 감지하지 못하므로 명시적인 릴리스 요청이 필요합니다.
- 자동화 스크립트·테스트 변경은 보수적으로 앱 영향으로 처리합니다. 실행 전 테스트를 CI check 작업에서도 수행합니다.

## 직접 준비할 항목

1. **Expo:** 기존 EXPO_TOKEN이 Update·Build·Submit에도 접근 가능한지 확인합니다. EAS의 preview 환경은 테스트 서버 설정, production 환경은 실제 서비스 설정으로 관리합니다. 현재 앱 전용 서버 변수는 없습니다.
2. **Google Play:** 개발자 계정, `com.tomyx.android` 앱, 첫 AAB 수동 업로드, Play 제출 권한이 있는 서비스 계정이 필요합니다. 서비스 계정 JSON은 EAS credentials에 저장합니다.
3. **Apple:** 유료 Developer 계정, `com.tomyx.ios` App Store Connect 앱, 배포 인증서·프로비저닝·API key를 준비합니다. 숫자 Apple 앱 ID를 `eas.json`의 `submit.production.ios.ascAppId`에 기록합니다. TestFlight 테스터와 그룹을 설정하고 설치할 수 있는지 확인합니다.
4. **자격증명 초기화:** `npx eas-cli@latest credentials --platform android`와 `--platform ios`로 서명·제출 자격증명을 준비합니다. 최초 비대화형 빌드 전에는 `npx eas-cli@latest build --profile testing --platform android` 또는 `ios`로 플랫폼별 초기 설정을 완료해야 할 수 있습니다. 이는 원격 유료 빌드를 시작할 수 있는 명령입니다.
5. **GitHub:** Actions Variable `APP_TEST_ENABLED`를 문자열 `true`로 등록합니다. 두 상태 태그를 Ruleset으로 막지 않고, 조직 정책이 워크플로의 contents:write를 허용하는지 확인합니다. 모든 태그에 동일한 보호 규칙이 있다면 이 두 이름만 예외로 둡니다.
6. **첫 검증:** 설정을 커밋하고 main에 반영한 뒤 Actions와 EAS에서 두 플랫폼의 최초 테스트 빌드·제출을 확인합니다. 다음 공통 UI 변경에서는 OTA 분기로 들어가는지, 설치한 테스트 앱을 다시 열었을 때 반영되는지 확인합니다. 실패한 플랫폼만 job을 재실행할 수 있습니다.

2026-10-19 사용자 확인상 Android 내부 테스트와 iOS TestFlight 수동 빌드·배포는 완료했습니다. Apple 앱 ID 6824389886을 제출 프로필에 반영했습니다. EAS에서 Android Play 제출용 서비스 계정과 iOS 제출 API 키·서명을 확인했습니다. 실제 권한과 제출 성공 여부는 CI 실행으로 검증합니다. 초기 설정을 끝낸 뒤 enable 변수를 켭니다. OTA 설정 이전에 설치한 앱은 새 바이너리를 설치해야 합니다. TestFlight 처리·심사나 Play 초기 검토로 업로드 직후 설치되지 않을 수 있습니다.

## 수동 프로덕션 반영

테스트 결과를 확인한 사람이 app-release로 프로덕션 릴리스를 요청합니다. testing 바이너리를 그대로 공개하면 testing OTA를 받으므로 그대로 스토어 공개하지 않습니다. production 프로필로 빌드하고 서명·환경·채널을 확인한 뒤 공개 심사·출시를 별도 진행합니다. production OTA도 기존 production 앱의 runtime과 호환될 때만 명시적으로 실행합니다. preview 환경에서 export한 테스트 업데이트를 production 채널로 무조건 옮기지 않습니다.

## 완료 조건과 검증

- 단위 테스트: 문서·웹 변경 생략, 공통 변경 판정, 호환 OTA, 첫 빌드와 제출 실패 복구, OTA·빌드 실패 시 기준 유지.
- 로컬 검증: Node 테스트 5개, lint·타입 검사·웹 export 통과. 워크플로 YAML·셸 구문·테스트/프로덕션 채널 분리·문서 링크 80개 확인.
- 실제 Android testing 빌드: dd216c2f-a799-4ec6-8e75-3396929fae61 성공, 사용자 수동 내부 테스트 출시 완료. 자동화 워크플로의 OTA·스토어 제출과 iOS TestFlight는 미검증입니다.
