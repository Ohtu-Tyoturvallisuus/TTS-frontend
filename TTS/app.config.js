import 'dotenv/config'

export default {
  name: "HazardHunt",
  slug: "HazardHunt",
  scheme: ["hazardhunt"],
  version: "1.0.3",
  owner: "telinekataja",
  orientation: "portrait",
  icon: "./assets/HazardHunt-icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/telinekataja.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  plugins: [
    "expo-localization"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.HazardHunt",
    icon: "./assets/HazardHunt-icon.png",
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
      foregroundImage: "./assets/HazardHunt-icon.png",
      backgroundColor: "#ffffff"
    },
    icon: "./assets/HazardHunt-icon.png",
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
    local_setup: process.env.LOCAL_SETUP || 'false',
    local_ip: process.env.LOCAL_IP,
    environment: process.env.ENVIRONMENT || 'main',
  }
}
