# Android 로컬 개발 환경

프로젝트 루트에서 `npm run android` 또는 `npx expo run:android`를 실행합니다. Android Studio에서는 먼저 사용할 에뮬레이터를 켭니다.

## SDK 위치

Android SDK가 설치돼 있어도 Gradle에 경로를 전달하지 않으면 `SDK location not found`로 실패할 수 있습니다. Android Studio의 SDK Manager에서 실제 SDK 위치를 확인합니다.

Expo CLI 실행에는 Git에서 제외하는 `.env.local`에 해당 PC의 절대 경로를 설정할 수 있습니다.

```dotenv
ANDROID_HOME=/Users/<사용자명>/Library/Android/sdk
```

Gradle을 직접 실행하거나 CLI 밖에서도 SDK를 사용하려면 쉘 환경에 설정합니다. Android Studio의 Gradle 실행 환경은 터미널과 다를 수 있습니다.

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="/opt/homebrew/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

위 Node 경로는 Apple Silicon Homebrew의 예시입니다. `command -v node`로 실제 설치 위치를 확인합니다. `Could not start 'node'`는 Gradle 프로세스가 Node 실행 파일을 찾을 수 있는지도 확인해야 합니다.

## NDK 설치

현재 React Native의 요구 버전은 `node_modules/react-native/gradle/libs.versions.toml`에서 확인합니다. 2026-10-15 로컬 빌드에서 React Native가 NDK `27.1.12297006`, expo-updates 모듈이 `27.0.12077973` 설치를 요구했습니다.

SDK Manager → SDK Tools → Show Package Details → NDK (Side by side)에서 정확한 버전을 설치합니다. 다른 버전이 있어도 요구 버전의 설치가 필요할 수 있습니다. 폴더만 생기고 `source.properties`가 없다면 설치가 완료된 것으로 보지 않습니다. 최초 빌드가 자동 설치를 시작하면 다운로드가 끝날 때까지 기다립니다.

## 오류 확인

`BUILD FAILED`와 Expo의 non-zero code 요약보다 앞에 나오는 `What went wrong`를 확인합니다. 필요하면 Gradle 상세 로그나 `~/.gradle/daemon/<버전>/daemon-*.out.log`를 사용합니다.

`android/`는 Expo가 생성하는 디렉터리이므로 해결을 위해 Gradle 파일을 임의로 수정하지 않습니다. 로컬 경로와 비밀값은 커밋하지 않습니다.

## EAS에서 runtime fingerprint 불일치

로컬 빌드나 IDE 도구가 node_modules 안에 Gradle wrapper·local.properties를 추가하거나 네이티브 소스를 수정하면 EAS의 깨끗한 설치와 fingerprint가 달라질 수 있습니다. 2026-10-15 빌드 6e0f0b4e-c350-4b56-a890-5403a521e72b에서 masked-view Manifest 변경과 3개 의존성의 로컬 생성 파일을 확인했습니다.

해결은 잠금 파일을 유지한 npm ci로 의존성을 원본으로 복원하는 것입니다. 패키지의 네이티브 소스를 fingerprint에서 통째로 제외하거나 호환성 검사를 끄지 않습니다. .fingerprintignore는 머신별 node_modules 내부 local.properties만 제외합니다. 패키지 소스를 의도적으로 수정해야 한다면 재현 가능한 패치로 관리합니다.
