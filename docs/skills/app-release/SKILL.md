---
name: app-release
description: ToMyX 앱 릴리스 요청 시 EAS로 Android·iOS 앱을 빌드하고 요청 범위에 따라 Google Play 내부 테스트·TestFlight에 제출한다. 앱 개발용 빌드나 내부 배포 요청에도 사용한다. 프로덕션 OTA·공개 배포는 명시적 요청 시에만 수행하며, CI의 테스트 자동화 설정은 별도 명세를 따른다.
---

# 앱 빌드와 배포

경로는 저장소 루트를 기준으로 해석합니다. [빌드와 배포 명세](../../specs/build-deploy.md)와 `eas.json`을 읽고, 요청된 플랫폼·소스 버전·빌드 목적을 정합니다. 스킬 작성·수정 요청은 릴리스 실행 요청이 아닙니다.

자동 테스트 배포의 상태·빌드 ID는 [앱 테스트 명세](../../specs/app-test-automation.md)와 플랫폼별 app-test 태그에서 확인합니다. testing 프로필 바이너리를 그대로 공개하면 testing 채널을 계속 받으므로 프로덕션 공개용으로 승격하지 않습니다. production 프로필로 다시 만들고 채널·환경을 확인합니다.

프로덕션 OTA 요청이면 마지막 production 바이너리와 fingerprint 호환성을 확인하고 production 환경에서 export해 production 채널에 publish합니다. 테스트 preview 환경의 OTA를 그대로 옮기지 않습니다. 불호환이면 바이너리 릴리스로 전환해야 함을 설명합니다. 공개 스토어 출시·심사는 사용자가 요청한 범위에서 별도 확인합니다.

## 요청을 실행 범위로 정하기

| 요청 | 프로필·기준 | 후속 작업 |
| --- | --- | --- |
| 개발용 앱 빌드 | development, 현재 개발 브랜치 | EAS 설치 링크 제공. 개발 서버 필요 |
| iOS 시뮬레이터 개발용 앱 | development-simulator | 빌드만 수행. 스토어 제출 불가 |
| 서버 없이 실행할 내부 배포 앱 | preview, 현재 개발 브랜치 | EAS 설치 링크 제공. 스토어 제출 없음 |
| 스토어용 앱 빌드 | production, main 또는 사용자가 지정한 ref | 빌드만 수행 |
| 앱 빌드와 배포·릴리스 | production, main 또는 사용자가 지정한 ref | 빌드 후 Google Play 내부 테스트·TestFlight 제출 |

플랫폼이 명시되지 않은 전체 앱 릴리스는 Android·iOS 모두를 대상으로 합니다. Android만 요청하면 Android만 수행합니다. 다른 제출 track, 공개 배포, 심사 제출은 현재 기본 범위에 포함되지 않습니다. 사용자가 변경을 요청하면 요구사항과 제출 설정을 먼저 맞춥니다. 명확히 요청한 빌드·제출에 대해 같은 권한을 다시 묻지 않습니다.

## 실행 전 확인

1. `git status --short --branch`와 관련 diff로 소스 상태를 확인하고 실제 대상 커밋 SHA를 기록합니다. main 릴리스 요청을 현재 develop 코드로 실행하지 않습니다. 필요한 경우 별도 작업 폴더를 사용해 기존 작업을 보존합니다. 미커밋 변경을 임의로 커밋·삭제하거나 사용자 지시 없이 다른 작업까지 릴리스하지 않습니다.
2. [문서 동기화 리뷰](../documentation-review/SKILL.md)를 수행하고 lint·타입 검사를 실행합니다. 정책 충돌·검사 실패를 해결하기 전에는 빌드하지 않습니다. 앱 코드·네이티브 변경이면 필요한 플랫폼 검증과 미검증 범위도 확인합니다.
3. `package.json`의 Expo 버전, 해당 버전 공식 문서와 `https://docs.expo.dev/llms.txt`의 Build·Submit 안내를 확인합니다. CLI 도움말로 필요한 옵션을 확인합니다. npm 프로젝트에서는 `npx eas-cli@latest`를 사용합니다.
4. `npx eas-cli@latest whoami`로 인증 상태를 확인하고 app.json의 owner·projectId·패키지 ID가 ToMyX인지 확인합니다. 토큰·비밀키를 출력하거나 문서에 남기지 않습니다.
5. 요청한 프로필·플랫폼의 서명 자격증명이 EAS에 준비됐는지 확인합니다. iOS 실기기 내부 배포는 기기 등록과 유효한 프로비저닝 프로필이 필요합니다. 새 기기를 추가했다면 프로필 갱신도 확인합니다.
6. 제출까지 요청한 경우 빌드 비용이 발생하기 전에 준비 상태를 확인합니다. Android는 Play 앱·첫 수동 업로드·EAS에 저장한 Google 서비스 계정, iOS는 App Store Connect 앱·API key·숫자 ascAppId가 필요합니다. iOS 앱 ID는 확인된 값을 `eas.json`의 `submit.production.ios.ascAppId`에 기록합니다. GitHub 변수는 로컬 스킬에 자동 전달되지 않습니다.

현재 iOS 앱은 등록 전으로 기록돼 있습니다. 실행 시 최신 상태를 확인하고, 빠진 계정·앱 등록·자격증명은 구체적으로 안내합니다. 부족한 정보를 임의로 만들거나 빌드 요청을 제출 요청으로 확대하지 않습니다.

## 빌드와 제출

빌드는 `npx eas-cli@latest build --platform <android|ios|all> --profile <프로필> --wait --non-interactive --json`으로 실행합니다. 결과 JSON은 작업별 임시 파일로 보관하고, 로그와 빌드 ID·플랫폼·상태·링크를 확인합니다. 자격증명 최초 설정으로 대화형 실행이 필요하면 그 설정을 먼저 처리합니다.

제출은 성공한 production 빌드에만 수행합니다. JSON의 플랫폼별 `FINISHED` 결과에서 빌드 ID를 찾아 `npx eas-cli@latest submit --platform <android|ios> --profile production --id <이번 빌드 ID> --wait --non-interactive`로 실행합니다. `--latest`를 사용하지 않습니다. 빌드 중 추가된 커밋을 섞거나 다른 실행의 바이너리를 제출하지 않습니다.

빌드·제출 실패 시 원인을 확인하고 해당 단계만 재시도합니다. 한 플랫폼만 실패했다면 성공한 플랫폼의 빌드·제출을 반복하지 않습니다. 이미 생성된 ID의 빌드나 제출 상태가 불명확하면 EAS 상태부터 조회하고 중복 작업을 시작하지 않습니다. 터미널 대기가 끝났다고 원격 작업이 취소됐다고 판단하지 않습니다.

## 결과 기록

플랫폼별 소스 SHA, 프로필, 빌드 ID·링크, 제출 결과와 미실행 항목을 보고합니다. 설치·실행을 직접 확인하지 않았다면 배포와 구분합니다. Google Play 내부 테스트와 TestFlight 업로드 성공은 스토어 공개나 Apple 처리·테스터 배포 완료를 의미하지 않습니다.

관련 명세의 검증 기록과 `docs/harness/handoff.md`에 결과·남은 작업을 갱신합니다. 결과 기록 때문에 다시 앱 빌드를 실행하지 않습니다. 스킬 실행만으로 Git 커밋·푸시 권한이 추가되지는 않습니다.
