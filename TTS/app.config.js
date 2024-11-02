import 'dotenv/config'

export default {
  name: "HazardHunt",
  slug: "HazardHunt",
  scheme: ["hazardhunt"],
  version: "1.0.2",
  owner: "telinekataja",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  plugins: [
    "expo-localization"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.HazardHunt",
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      "LSMinimumSystemVersion": "12.0",
      "NSMicrophoneUsageDescription": "App needs access to your microphone for speech to text.",
      "NSCameraUsageDescription": "App needs access to your camera for taking pictures.",
      "NSPhotoLibraryUsageDescription": "App needs access to your photo library to select pictures."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.HazardHunt",
    permissions: [
      "RECORD_AUDIO",
      "CAMERA",
      "READ_EXTERNAL_STORAGE"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  updates: {
    url: `https://u.expo.dev/${process.env.EXPO_PUBLIC_EAS_PROJECT_ID}`
  },
  runtimeVersion: {
    policy: "appVersion"
  },
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID
    },
    local_setup: process.env.LOCAL_SETUP,
    local_ip: process.env.LOCAL_IP
  }
}
