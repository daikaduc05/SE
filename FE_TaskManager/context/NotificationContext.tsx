import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  RefObject,
} from "react";
import * as Notifications from "expo-notifications";
import { EventSubscription } from "expo-notifications";
import registerForPushNotificationsAsync from "@/untils/registerPushNofiticationsAsyn";
import { io, Socket } from "socket.io-client";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { router } from "expo-router";

/* -------------------------------------------------------------------------- */
/*                               Context types                                */
/* -------------------------------------------------------------------------- */
interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  isNotificationEnabled: boolean;
  setIsNotificationEnabled: (value: boolean) => void;
  socketRef: RefObject<Socket | null>;
  channels: Notifications.NotificationChannel[];
}

/* -------------------------------------------------------------------------- */
/*                                 Context                                    */
/* -------------------------------------------------------------------------- */
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                             Provider component                              */
/* -------------------------------------------------------------------------- */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  /* ------------------------------ State / refs ----------------------------- */
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );

  const socketRef = useRef<Socket | null>(null);
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  /* ------------------- Global notification behaviour ---------------------- */
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  /* --------------------- Register push & load channels -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token ?? null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
  
      if (Platform.OS === "android") {
        const ch = await Notifications.getNotificationChannelsAsync();
        setChannels(ch ?? []);
      }
  
      // 🔔 Check if app was opened from a notification (after being killed)
      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastResponse) {
        const url = '/userInfo/nofitication'; // Replace with your desired URL
        router.push(url); // Navigate to the desired screen
      }
    })();
  }, []);
  

  /* ---------- Foreground & interaction listeners for notifications -------- */
  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((incoming) => {
        if (isNotificationEnabled) setNotification(incoming);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("🔔 User clicked notification:", response);
        router.push("/userInfo/nofitication"); // Navigate to the desired screen
        // const data = response.notification.request.content.data;
        // if (data?.screen === "TaskDetail" && data?.taskId) {
        //   rou  ter.push(`/dashboard/task/${data.taskId}`);
        // }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [isNotificationEnabled]);

  /* ----------------------- Socket connection & events --------------------- */
  useEffect(() => {
    let isMounted = true;

    const connectSocket = async () => {
      try {
        const token = (await SecureStore.getItemAsync("token")) as
          | string
          | null;
        if (!token) return;
        const decoded = jwtDecode<{ id: string }>(token);
        const userId = decoded.id;

        if (!isMounted) return;

        const socket = io(String(process.env.EXPO_PUBLIC_API_URL), {
          transports: ["websocket"],
          query: { userId },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("🟢 Socket connected:", socket.id);
        });

        /**
         * Common handler for both generic & personal notifications
         */
        const handleIncoming = async (msg: any) => {
          if (!isNotificationEnabled) return;

          const token = await SecureStore.getItemAsync("token");
          const decoded = jwtDecode<{ id: string }>(token ?? "");

          // 🛑 Nếu chính mình gửi thì không hiện
          if (msg.senderId === decoded.id) {
            console.log("🔕 Bỏ qua thông báo chính mình");
            return;
          }

          console.log("📥 Received socket notification:", msg);

          const title = msg.title || "New Notification";
          const body = msg.body || "You have a new message";

          // Update UI context
          setNotification({
            request: {
              trigger: null,
              identifier: "socket",
              content: { title, body, data: msg },
            },
            date: Date.now(),
          } as Notifications.Notification);

          // Hiện thông báo local trên máy
          await Notifications.scheduleNotificationAsync({
            content: {
              title : title,
              body : body,
              data: msg,
            },
            trigger: null,
          });
        };

        // Broadcast & personal events
        socket.on("receive_message", handleIncoming);
        socket.on(`noti:${userId}`, handleIncoming);

        /* ------------------------- < thêm dòng này > ------------------------ */
        // Nếu server gửi chung event noti:<userid>, vẫn dùng cùng handler
        // Giữ nguyên logic setNotification + schedule ở trên.

        socket.on("disconnect", () => {
          console.log("🔴 Socket disconnected");
        });
      } catch (err) {
        console.error("Socket error:", err);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [isNotificationEnabled]);

  useEffect(() => {
    (async () => {
      if (!expoPushToken) return;
      else {
        try {
          const response = axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/api/v1/notifications/push-token`,
            {
              token: expoPushToken,
            },
            {
              headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync(
                  "token"
                )}`,
              },
            }
          );
          // console.log("Push token registered:", response.data);
        } catch (error) {
          console.error("Error registering push token:", error);
        }
      }
    })();
  }, [expoPushToken]);

  /* ---------------------------- Provider value ---------------------------- */
  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        error,
        isNotificationEnabled,
        setIsNotificationEnabled,
        socketRef,
        channels,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
