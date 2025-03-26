# Vivocha React Native Demo App (Expo)

This repository contains an **Expo-based React Native app** demonstrating how to integrate the `react-native-vivocha` plugin for live chat and customer engagement.

> **Note:** This project uses a **custom Expo dev client**. It will not work with Expo Go.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- Expo CLI (`npm install -g expo-cli`)
- Xcode and/or Android Studio installed
- A valid Vivocha account with account ID and service ID

### Clone and Run

```sh
git clone https://github.com/vivocha/vivocha-react-native-demo.git
cd vivocha-react-native-demo
npm install
```

Run the app with a custom dev client:

```sh
npx expo run:ios
# or
npx expo run:android
```

Update the Vivocha configuration in `App.tsx`:

```ts
const vivochaAcctId = 'your_account_id';
const vivochaServId = Platform.select({
  android: 'your_android_service_id',
  ios: 'your_ios_service_id',
  default:''
});
```

---

## 📦 Using `react-native-vivocha` in Your Expo App

Once published, the plugin can be installed via npm:

```sh
npm install --save @vivocha/react-native-vivocha
```

Because the plugin contains native code, you must use a **custom Expo dev client**.

### Setup Instructions

1. Install Expo Dev Client:

   ```sh
   npx expo install expo-dev-client
   ```

2. Build and run the app:

   ```sh
   npx expo run:ios
   # or
   npx expo run:android
   ```

3. Import and use the plugin in your code:

   ```ts
   import Vivocha from '@vivocha/react-native-vivocha';
   ```
