import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNotification } from "@/context/NotificationContext";
import BackButton from "@/common/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface NotificationItem {
  id: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationScreen = () => {
  const { notification } = useNotification();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/users/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data) {
          const notiData: NotificationItem[] = res.data.map((item: any) => ({
            id: String(item.id),
            body: item.notification.content,
            timestamp: item.notification.createdAt,
            isRead: item.isRead,
          }));
          setNotifications(notiData);
          console.log("renderdata", notiData);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notification) {
      const newNoti: NotificationItem = {
        id: Date.now().toString(),
        body: notification.request?.content?.body || "No Body",
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [newNoti, ...prev]);
    }
  }, [notification]);

  const handleDeleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    try {
      await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/users/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReadStatus = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/users/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />

      <BackButton />
      <View className="flex-row justify-between items-center mt-20 px-4 ">
        <Text className="text-white text-2xl font-bold text-center flex-1 ">
          Notifications
        </Text>
      </View>

      <ScrollView className="flex-1 bg-[#1D2760] top-0 left-0 rounded-t-[40px] px-6 py-8 mt-10">
        <View className="p-2 rounded-t-[40px]">
          {notifications.length !== 0 ? (
            notifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (!item.isRead) toggleReadStatus(item.id);
                }}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl mb-4 shadow-lg ${
                  item.isRead ? "bg-white" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-gray-700 mt-1 ${
                    !item.isRead ? "font-bold text-black" : "font-normal"
                  }`}
                >
                  {item.body}
                </Text>
                <Text className="text-gray-400 text-xs mt-2">
                  {new Date(item.timestamp).toLocaleString()}
                </Text>

                <View className="flex-row justify-between mt-5">
                  {/* Delete button giữ nguyên */}
                  <TouchableOpacity
                    onPress={() => handleDeleteNotification(item.id)}
                    className="bg-red-500 px-3 py-1 rounded-full"
                  >
                    <Text className="text-white text-sm font-medium">
                      Delete
                    </Text>
                  </TouchableOpacity>

                  {/* Trạng thái Read/Unread chỉ để hiển thị */}
                  <View
                    className={`px-3 py-1 rounded-full ${
                      item.isRead ? "bg-green-600" : "bg-gray-600"
                    }`}
                  >
                    <Text className="text-white text-xs font-bold">
                      {item.isRead ? "Read" : "Unread"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="flex-col justify-center items-center mt-20">
              <Text className="text-gray-300 text-lg font-medium">
                No notifications yet.
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                Check back later
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;
