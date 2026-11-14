# lexiflow

React Native (Expo) app for translation, chat and PDF word lookup using an on-device LLM. The Qwen3 0.6B model is loaded once with react-native-executorch in a single provider and reused by all screens through two React contexts, one for state and one for actions. No backend required.

## Requirements

- Node.js 18 or newer
- JDK 17 and Android Studio with the Android SDK (for Android)
- Xcode 15 or newer on macOS (for iOS)
- An Android emulator, iOS simulator, or a physical device
- Internet connection on first launch (the model is downloaded once)

This project uses native modules (`react-native-executorch`, `react-native-pdfview`), so it **cannot run in Expo Go**. It must be run as a development build.

## Installation

```bash
git clone https://github.com/OffcGrid/lexiflow.git
cd lexiflow
npm install
```

## Run on Android

1. Start an emulator from Android Studio (Device Manager), or connect a physical device with USB debugging enabled.
2. Build and install the app:

```bash
npm run android
```

The first build generates the native `android/` project and can take several minutes. Later runs are faster.

## Run on iOS (macOS only)

```bash
npm run ios
```

This builds the app and launches it in the iOS simulator.

## Start the dev server

If the app is already installed, start only the Metro bundler:

```bash
npm start
```

Then press `a` for Android or `i` for iOS.

## Build with EAS (no local Android Studio or Xcode)

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

Install the resulting APK on a device, then run `npm start` and open the app.

## First launch

On first launch the app downloads the model and shows a progress screen. After the download completes, the app opens and generation runs on the device without a network connection.

## Notes

- A physical device is recommended. On-device inference is slow on emulators, and some emulator CPU architectures (such as x86) may not be supported by ExecuTorch.
- Check the [react-native-executorch documentation](https://docs.swmansion.com/react-native-executorch/) for the minimum supported Android and iOS versions.
- The New Architecture is enabled (`newArchEnabled: true` in `app.json`) and is required by the native dependencies.
