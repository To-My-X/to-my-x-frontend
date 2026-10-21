# 브랜치별 빌드와 배포

- 유형: 개발 환경·배포 흐름
- 명세 상태: 확정
- 구현 상태: 파일 구성 완료, 외부 연결 대기
- 검증 상태: 일부 확인
- 갱신일: 2026-10-14
- 확정 근거: 사용자가 브랜치별 웹 자동 배포와 스킬을 통한 앱 빌드·배포로 변경했습니다. 웹은 EAS Hosting, 앱 제출은 Google Play 내부 테스트와 TestFlight입니다.
- 관련 규칙: [브랜치 운영](../conventions/branch.md)
- 관련 서비스 정책: 없음

## 목적과 범위 — PRD

브랜치 반영 시 웹 검사·빌드·배포를 자동화합니다. 앱은 main에서 [테스트 배포 자동화](app-test-automation.md)로 변경을 판정합니다. 앱 프로덕션 릴리스는 사람이 [app-release 스킬](../skills/app-release/SKILL.md)로 요청합니다.

| 대상 | 웹 | Android | iOS |
| --- | --- | --- | --- |
| develop | 정적 빌드와 EAS Hosting develop alias 배포 | 자동 실행 없음 | 자동 실행 없음 |
| main | 정적 빌드와 EAS Hosting 프로덕션 배포 | 변경 판정 후 테스트 OTA 또는 Play 내부 테스트 | 변경 판정 후 테스트 OTA 또는 TestFlight |
| 두 브랜치 대상 PR | 검사와 정적 빌드 결과 보관 | 실행 없음 | 실행 없음 |

앱 테스트 자동화의 설정·판정·수동 프로덕션 절차는 [별도 명세](app-test-automation.md)를 따릅니다. 자동 스토어 공개·심사 제출은 포함하지 않습니다. development 앱은 개발 서버에 연결하는 클라이언트입니다. 서버 없이 실행할 내부 테스트 앱은 기존 preview 프로필을 별도 사용합니다.

## 실행 흐름 — IA

`PR 또는 push → npm ci → lint → 타입 검사 → 웹 빌드 → push 대상 웹 배포`

`앱 릴리스 요청 → app-release → 대상 소스·문서·검사·자격증명 확인 → EAS 빌드 → 요청한 스토어 제출`

- push는 병합뿐 아니라 직접 푸시도 포함합니다. 검사가 실패하면 후속 작업을 실행하지 않습니다.
- 웹 빌드 결과 dist를 Actions artifact로 보관한 뒤 develop은 alias, main은 프로덕션 URL에 배포합니다.
- 앱 테스트 배포는 main에서 enable 변수와 마지막 성공 기준에 따라 실행합니다. 수동 앱 릴리스도 가능하며, 기본 소스는 main입니다. 성공한 이번 빌드 ID만 제출하며 `--latest`는 사용하지 않습니다.
- 같은 브랜치의 실행은 직렬화합니다. 실행 중인 작업은 취소하지 않습니다. GitHub concurrency는 여러 대기 실행 중 이전 대기 실행을 대체할 수 있으므로 모든 중간 커밋의 빌드를 보장하는 큐가 아닙니다.
- 수동 실행은 develop·main에서 가능합니다. 다른 브랜치에서는 검사와 웹 빌드만 수행합니다.

## 구현 설계 — Tech Spec

- 원본: `.github/workflows/build-deploy.yml`, `eas.json`, `package.json`, `eslint.config.js`
- GitHub Actions Linux runner·Node.js 24에서 npm 잠금 파일로 설치하고 Expo 기본 ESLint 설정과 타입 검사를 수행합니다. 네이티브 컴파일·서명은 EAS Build에서 수행합니다.
- EAS는 `npx --yes eas-cli@latest`로 실행합니다. 네이티브 프로필의 EAS 환경은 development·production으로 명시했습니다.
- 웹 export는 Actions 환경에서 수행합니다. 현재 앱별 환경변수는 없습니다. 추가 시 웹과 네이티브의 `EXPO_PUBLIC_*` 값이 같은 환경을 가리키도록 별도 설정합니다.
- 웹 Actions 타임아웃은 20분입니다. 앱 스킬은 원격 Build·Submit 완료를 기다리며, 터미널 종료가 원격 작업도 취소한다고 가정하지 않습니다.
- 기존 production의 원격 버전 autoIncrement를 유지합니다. iOS 앱 ID는 앱 등록 후 eas.json의 submit.production.ios.ascAppId에 확인된 값을 기록합니다.
- [문서 리뷰 스킬](../skills/documentation-review/SKILL.md)은 에이전트가 커밋·로컬 빌드 전에 수행합니다. CI에는 AI 문서 리뷰 실행 환경이 없으며 lint·타입 검사가 문서 의미까지 검증하지 않습니다.

## 활성화에 필요한 설정

### GitHub

Settings → Secrets and variables → Actions에서 설정합니다. 비밀값은 저장소나 대화에 기록하지 않습니다.

| 종류 | 이름 | 용도 |
| --- | --- | --- |
| Secret | EXPO_TOKEN | ToMyX EAS 프로젝트의 빌드·배포·제출 권한이 있는 Expo 토큰 |

2026-10-14 EXPO_TOKEN secret 등록을 확인했고, 사용자가 웹 준비 완료를 확인했습니다. App Store Connect 앱은 사용자 확인상 등록 전입니다. 파일 구성이 완료돼도 실제 배포 활성화까지 완료됐다고 보고하지 않습니다.

### EAS Hosting

Expo 프로젝트의 Hosting 화면에서 preview subdomain을 먼저 선택합니다. 최초 이름 선택이 남아 있으면 비대화형 배포가 실패할 수 있습니다. develop alias와 프로덕션 URL은 실제 CLI 출력·Hosting 화면에서 확인합니다.

### 서명과 스토어 연결

1. Android keystore와 iOS 인증서·프로비저닝 프로필을 EAS에 준비합니다. 앱 스킬에서 사용할 플랫폼·프로필을 먼저 설정합니다.
2. development 프로필의 iOS 실기기 빌드는 Apple Developer 계정과 등록한 기기 UDID가 필요합니다. 새 기기를 추가하면 프로비저닝 프로필을 갱신합니다. development-simulator는 수동 테스트용으로 유지합니다.
3. Google Play에 `com.tomyx.android` 앱을 만들고 첫 바이너리 업로드를 수동으로 완료합니다. Google Play 서비스 계정과 제출 권한을 설정하고 EAS에 제출 자격증명으로 저장합니다.
4. App Store Connect에 `com.tomyx.ios` 앱을 만들고 숫자 앱 ID를 eas.json의 submit.production.ios.ascAppId에 기록합니다. API key는 EAS에 제출 자격증명으로 저장합니다.
5. `npx eas-cli@latest credentials --platform android`와 `npx eas-cli@latest credentials --platform ios`로 자격증명을 관리합니다. 비밀키를 코드에 넣지 않습니다.

Submit 성공은 공개 완료가 아닙니다. Google Play 초기 설정·검토, Apple의 처리 완료와 TestFlight 그룹 설정이 추가로 필요할 수 있습니다.

웹 테마 훅의 초기 hydration 상태 갱신은 정적 HTML과 첫 클라이언트 렌더를 맞추는 기존 동작입니다. 해당 줄에만 `react-hooks/set-state-in-effect` 예외와 근거를 기록했습니다.

## 정식 출시 전 계정·앱 식별자 점검

2026-10-20 확정: 현재 연결된 계정과 앱 식별자로 내부 테스트를 계속합니다. 서비스 이름과 최종 배포 계정은 아직 확정하지 않았습니다. 새로운 Apple 계정으로 즉시 전환하거나 기존 테스트 앱을 삭제하지 않습니다.

앱 이름만 바꾸는 경우에는 식별자를 바꿀 필요가 없습니다. 최종 결정에 따라 Android 패키지명과 iOS Bundle ID도 바꾼다면 양쪽 스토어에 별도 앱으로 등록하고 배포 연결을 다시 검증합니다. 기존 테스트 앱의 업데이트나 데이터·테스터 자동 이전을 전제로 하지 않습니다.

공개 출시용 빌드를 만들거나 심사·공개 배포를 진행하기 전에 다음을 반드시 확인하고, 결과를 이 문서와 인수인계에 기록합니다. 계정·식별자가 미확정이면 해당 공개 출시 작업은 진행하지 않고 미결정 항목을 확인합니다. 현재 계정의 내부 테스트는 계속할 수 있습니다.

- 최종 표시 이름과 각 스토어의 앱 소유 계정·Apple 개발자 팀이 확정됐는가?
- Android package와 iOS bundleIdentifier를 유지할지 변경할지 결정했는가? 양쪽 값이 같아야 할 기술적 요구는 없습니다.
- app.json의 표시 이름·식별자, 스토어 앱 정보와 eas.json의 ascAppId가 최종 대상과 일치하는가?
- EAS의 플랫폼별 서명·제출 인증이 최종 계정과 앱에 연결돼 있는가? Expo owner·projectId는 Apple 계정 변경만으로 바꾸지 않습니다.
- 식별자가 바뀌었다면 새 앱의 버전 관리와 필요한 초기 업로드를 확인하고, 새 바이너리 빌드·내부 테스트 제출·설치·실행을 다시 검증했는가?
- 자동화 성공 기준 태그 app-test-android·app-test-ios가 이전 앱의 기록을 재사용하지 않는가? 대상 변경 시 기존 상태를 보존·확인한 뒤 해당 플랫폼 기준을 재설정하거나 앱별로 분리하고, 새 앱 최초 실행이 OTA가 아닌 빌드·제출로 진행되도록 합니다. 태그는 지금 삭제하지 않습니다.
- production 환경·채널과 최종 앱의 runtime이 맞는가? 기존 테스트 앱의 OTA 성공을 새 앱 배포 검증으로 대신하지 않습니다.

최종 계정·표시 이름·식별자·스토어 앱 ID와 전환 실행 시점은 미정입니다. 위 점검은 에이전트 릴리스 절차이며, CI가 이 결정을 자동으로 검증하는 기능은 아직 없습니다.

## 제품 공개 출시 준비

제품 기능을 공개할 때는 [출시 운영값과 인수 기준](../policy/launch-operations.md)의 실제 약관·공급자 연결·문의 주소·자산과 화면별 QA도 확인합니다. 전달 자료는 필수 운영값 누락 시 공개 배포 차단을 요구합니다. 현재 CI에는 이 제품 설정 검사가 없으며, 기존 웹 자동 배포·앱 내부 테스트 성공을 제품 출시 준비 완료로 보지 않습니다. 검사 구현과 배포 연결 방식은 제품 연동 단계에서 정하고 검증합니다.

## 완료 조건과 검증

| 조건 | 검증 방법 | 현재 결과 |
| --- | --- | --- |
| 브랜치별 빌드·배포 대상 일치 | YAML·프로필·분기 검사 | 통과 |
| PR 원격 배포·앱 작업 차단 | YAML job·step 확인 | 통과 |
| lint·타입 검사 성공 | npm run lint, npm run typecheck | 통과 |
| 웹 정적 빌드 성공 | npm run build:web | 통과 |
| develop 웹 배포 성공 | Actions 38521762369 | 통과 |
| main 웹 배포·앱 빌드·제출 | 각 대상의 실제 실행 | 미실행 |

## 변경 기록

- 2026-10-14: 웹은 develop·main 자동 배포, 앱은 요청 시 app-release 스킬로 빌드·제출하도록 확정했습니다. 머지마다 앱 바이너리를 생성하는 미커밋 구성을 변경했습니다.

## CI 검증 기록 — 2026-10-14

- 최초 실행 38521616720: lint 통과, 타입 검사 실패. Git에서 제외한 expo-env.d.ts에 CSS 타입 참조가 의존해 깨끗한 runner에서 실패했습니다.
- src/types/expo.d.ts에 Expo 타입 참조를 추가해 생성 파일 없이도 검사하도록 수정했습니다. 재실행 38521762369에서 lint·타입 검사·웹 빌드·artifact 업로드·EAS Hosting 배포가 모두 통과했습니다. 테스트 주소: https://to-my-x--develop.expo.app
