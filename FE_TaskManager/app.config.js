
export default () => ({
  expo: {
    name: "FE_TaskManager",
    slug: "FE_TaskManager",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true
    },

    android: {
      package: "com.hadeptrai.FE_TaskManager",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },

    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#ffffff",
          defaultChannel: "default",
          enableBackgroundRemoteNotifications: false
        }
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store",
       "expo-av"
    ],

    experiments: {
      typedRoutes: true
    },

    extra: {
      JWT_SECRET: "2d398f94e0194db2a0e23c8b1bc2b86524ff92c7a33cbf1d0910dbb95d15d8cb",
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      expoRouter: {
        origin: "myapp://"
      },
      eas: {
        projectId: "f038b2e4-35c9-407f-9551-d4bd4ee8b9bf"
      }
    },

    owner: "hadeptrai"
  }
});
