export default ({ config }) => ({
  ...config,
  name: "Pasio AI",
  slug: "pasio-ai",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/play_store_512.png",
  scheme: "pasioai",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  extra: {
    eas: {
      projectId: "28749568-2f39-4755-bf31-e37ac2d46cc6",
    },
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY, // ← NOW THIS WORKS
  },

  ios: {
    supportsTablet: true,
  },

  android: {
    package: "com.stikom.pasioai",
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/ic_launcher_foreground.png",
      backgroundImage: "./assets/images/ic_launcher_background.png",
      monochromeImage: "./assets/images/ic_launcher_monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },

  web: {
    output: "static",
    favicon: "./assets/images/icon-512.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/play_store_512.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
