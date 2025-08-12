import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  Modal,
} from "react-native";
import { useNotification } from "@/context/NotificationContext";
import BackButton from "@/common/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

interface NotificationItem {
  id: string;
  isRead: boolean;
  body: string;
  timestamp: string;
  type?: string | null;
  idObject?: number | null;
  idTask?: number | null;
}

const NotificationScreen = () => {
  const { notification } = useNotification();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [filter, setFilter] = useState<"All" | "Read" | "Unread">("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const res = await axios.get(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/users/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data) {
          const notiData: NotificationItem[] = res.data.map((item: any) => ({
            id: String(item.id),
            isRead: item.isRead,
            body: item.notification.content,
            timestamp: item.notification.createdAt,
            type: item.notification.type,
            idObject: item.notification.idObject,
            idTask: item.notification.idTask,
          }));
          setNotifications(notiData);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [isLoading]);

  useEffect(() => {
    if (notification) {
      setIsLoading(!isLoading);
    }
  }, [notification]);

  const handleDeleteNotification = async (id: string) => {
    const isFromServer = !id.startsWith("temp_") && !isNaN(Number(id));
    if (!isFromServer) return;

    try {
      const res = await axios.delete(
        `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/users/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        ToastAndroid.show("Notification deleted", ToastAndroid.SHORT);
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReadStatus = async (id: string) => {
    try {
      const res = await axios.put(
        `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/users/notifications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isRead: !item.isRead } : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      const res = await axios.delete(
        `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/users/notifications`,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
          },
        }
      );
      if (res) {
        setNotifications([]);
        ToastAndroid.show("All notifications deleted", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredNotifications = [...notifications]
    .filter((item) => {
      if (filter === "All") return true;
      if (filter === "Read") return item.isRead;
      if (filter === "Unread") return !item.isRead;
    })
    .sort((a, b) => Number(a.isRead) - Number(b.isRead)); // Unread lên trước

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
      <View className="relative justify-center items-center mt-20 px-4">
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-white text-2xl font-bold">Notifications</Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={() => setConfirmVisible(true)}
            className="ml-auto bg-red-600 px-3 py-2 rounded-full"
          >
            <Text className="text-white text-xs font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter buttons */}
      <View className="flex-row justify-center gap-4 mt-10">
        {["All", "Unread", "Read"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full ${
              filter === f ? "bg-white" : "bg-[#313384]"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                filter === f ? "text-black" : "text-white"
              }`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 bg-[#1D2760] rounded-t-[40px] px-6 py-8 mt-4">
        <View className="p-2">
          {filteredNotifications.length !== 0 ? (
            filteredNotifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (!item.isRead) toggleReadStatus(item.id);
                }}
                onLongPress={() => {
                  if (item.type === "task" && item.idTask && item.idObject) {
                    router.replace({
                      pathname: "/dashboard/project/[project]/task/[id]",
                      params: {
                        project: item.idObject,
                        id: item.idTask,
                      },
                    });
                  }
                  if (item.type === "object" && item.idObject) {
                    router.replace({
                      pathname: "/dashboard/project/[project]",
                      params: { project: item.idObject },
                    });
                  }
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
                  <TouchableOpacity
                    onPress={() => handleDeleteNotification(item.id)}
                    className="bg-red-500 px-3 py-1 rounded-full"
                  >
                    <Text className="text-white text-sm font-medium">
                      Delete
                    </Text>
                  </TouchableOpacity>
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

      {/* Modal xác nhận xóa tất cả */}
      {confirmVisible && (
        <Modal transparent animationType="fade" visible={confirmVisible}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-[80%] p-6 rounded-xl">
              <Text className="text-center text-lg font-semibold mb-4">
                Are you sure you want to delete all notifications?
              </Text>
              <View className="flex-row justify-around mt-4">
                <TouchableOpacity
                  className="bg-red-500 px-6 py-2 rounded-md"
                  onPress={() => {
                    handleDeleteAllNotifications();
                    setConfirmVisible(false);
                  }}
                >
                  <Text className="text-white font-medium">Delete All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-300 px-6 py-2 rounded-md"
                  onPress={() => setConfirmVisible(false)}
                >
                  <Text className="text-black font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
