import { router, Stack } from "expo-router";

import "../global.css";

import * as Notifications from "expo-notifications";
import { NotificationProvider } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  // const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/"); // Nếu không có token, chuyển về màn hình đăng nhập
      }
    };
    checkToken();
  }, []);

  // if (!isReady) return null;
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </NotificationProvider>
  );
}
