# iOS 로컬 개발 환경

프로젝트 루트에서 `npm run ios`로 시뮬레이터용 앱을 빌드·실행합니다. 로컬 빌드에는 Xcode와 iOS Simulator가 필요합니다.

## Xcode 27과 Scene 생명주기

2026-10-15 확인한 환경은 Expo `57.0.28`, Xcode `27.0`, iOS Simulator `27.0`입니다. iOS 27 SDK로 빌드한 앱은 UIKit Scene 생명주기를 사용해야 합니다. Expo SDK 57은 기본값이 이전 방식이어서 별도 활성화가 필요합니다.

`app.json`의 `expo-build-properties` 플러그인에 `ios.enableSceneSupport: true`를 설정했습니다. Expo 57.0.23 이상과 이 옵션을 지원하는 플러그인이 필요하며, 설치된 플러그인은 57.0.22입니다. SDK 58 이상으로 올릴 때는 기본 지원 여부를 확인하고 불필요해진 옵션을 제거합니다.

설정을 바꾼 뒤 Expo prebuild로 iOS 프로젝트를 재생성하고 앱을 다시 빌드해야 합니다. OTA나 Metro 재시작만으로 해결되지 않습니다. 생성된 Info.plist나 AppDelegate를 직접 수정하지 않습니다.

```bash
npx expo prebuild --platform ios
npm run ios
```

prebuild는 생성한 iOS 코드를 재구성할 수 있으므로 앱 설정·config plugin을 원본으로 관리합니다. Swift 파일을 임의로 수정해 설정을 유지하지 않습니다.

확인할 생성 결과:

- Info.plist의 UIApplicationSceneManifest와 EXExpoAppSceneDelegate
- AppDelegate의 ExpoReactNativeFactoryProvider 채택
- AppDelegate에서 직접 window를 만들고 startReactNative를 호출하는 이전 시작 코드 제거

공식 근거: [Expo SDK 57 Scene 지원 안내](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27).

## 검증 기록

- 2026-10-15: 공식 플러그인 설정 후 iOS 프로젝트 재생성, CocoaPods 설치, 로컬 빌드와 iPhone 18 Pro·iOS 27 시뮬레이터 설치·실행 성공. 앱 프로세스 유지 확인. 기능 전체와 스토어 빌드는 미검증입니다.
