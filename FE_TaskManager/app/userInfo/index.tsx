import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ToastAndroid,
  Modal,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Animated from "react-native-reanimated";
import axios from "axios";
import ImagePickerExample from "@/common/imagePicker";
import BackButton from "@/common/BackButton";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "@/context/NotificationContext";

// Component chính cho trang UserInfo
const UserInfo = () => {
  const [username, setUsername] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [notifications, setNotifications] = useState<boolean>();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {setIsNotificationEnabled } = useNotification();
  const [imageSelected, setImageSelected] = useState<string | null>(null);

  const handleSaveChanges = async () => {
    const user = {
      name: username,
      avatar: avatar,
      notiSettings: notifications,
      isBanned: isBanned,
    };

    try {
      const res = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/users`,
        user,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        setIsNotificationEnabled(user.notiSettings || true);
        ToastAndroid.show("Changes saved successfully", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Changes saved failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Error saving changes:", error);
      ToastAndroid.show("Error saving changes", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = (await SecureStore.getItemAsync("token")) as string;
      const decoded = jwtDecode<{ id: string }>(token);
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res) {
          console.log("User data:", res.data);
          setUsername(res.data.name);
          setAvatar(res.data.avatar);
          setNotifications(res.data.notiSettings);
          setIsBanned(res.data.isBanned);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveNewPassword = async () => {
    try {
      const res = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/users/password`,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        ToastAndroid.show("Password changed successfully", ToastAndroid.SHORT);
        router.push("/dashboard");
      } else {
        ToastAndroid.show("Password change failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Error saving new password:", error);
      ToastAndroid.show("Error saving new password", ToastAndroid.SHORT);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res) {
        ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
        router.push("/login");
      } else {
        ToastAndroid.show("Account deletion failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Error deleting account:", error);
      ToastAndroid.show("Error deleting account", ToastAndroid.SHORT);
    }
  };

  return (
    <View className="flex-1 bg-[#1D2760]">
      {/* Gradient background */}
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />
      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-[80%] items-center">
            <Text className="text-lg font-semibold text-center mb-4 text-black">
              Are you sure you want to delete your account?
            </Text>
            <View className="flex-row justify-around w-full mt-2">
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  handleDeleteAccount();
                }}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Yes, delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text className="text-black font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header với nút back */}
      <View className="flex-row items-start p-6 mt-10 justify-center">
        <BackButton />
        <Text className="text-white text-xl font-bold ml-4 ">
          Profile Setting
        </Text>
      </View>

      {/* Phần chính */}
      <ScrollView className="flex-1 bg-[#1D2760]/80 rounded-t-[40px] mt-6 p-6">
        {/* Phần avatar */}
        <View className="items-center mb-8">
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../../assets/images/placeholderAva.jpg")
            }
            className="w-24 h-24 rounded-full bg-white mb-2 border-4 border-[#CACCFD]"
          />
          <ImagePickerExample setImage={setAvatar} setImageSelect={setImageSelected} />
        </View>

        {/* Profile setting */}
        <View className="mb-8 flex-col gap-2">
          <Text className="text-white mb-4  font-semibold ">
            Enter new name
          </Text>
          <TextInput
            value={username}
            onChangeText={(text) => setUsername(text)}
            className="bg-[#313384]/50 p-3 rounded-xl text-white mb-4 border border-[#CACCFD]/50"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />

          {/* Notifications toggle */}
          <View className="flex-row gap-3 items-center mt-2">
            <FontAwesome name="bell" size={24} color="white" />
            <Text className="text-white font-semibold">Notifications</Text>
            <TouchableOpacity
              onPress={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full ${
                notifications ? "bg-[#5a65e4]" : "bg-gray-500"
              } justify-center px-1`}
            >
              <Animated.View
                className="w-4 h-4 rounded-full bg-white"
                style={{
                  transform: [{ translateX: notifications ? 24 : 0 }],
                  animationDuration: "1000ms",
                }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="w-fit ml-[50%] h-[30px] bg-[#e3e3e3] rounded-xl items-center justify-center"
            onPress={handleSaveChanges}
          >
            <Text className="text-black font-semibold">Save changes</Text>
          </TouchableOpacity>
        </View>

        {/* Change password */}
        <View className="mb-8">
          <View className="flex-col gap-4">
            <Text className="text-white font-semibold">Change password</Text>

            {/* Current Password */}
            <View className="flex-row items-center gap-2">
              <TextInput
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
                className="flex-1 bg-[#313384]/50 p-3 rounded-xl text-white mb-4 border border-[#CACCFD]/50"
                placeholderTextColor="rgba(255,255,255,0.5)"
                placeholder="Enter current password"
                secureTextEntry={!isCurrentPasswordVisible}
              />
              <TouchableOpacity
              className="mb-2"
                onPress={() => setIsCurrentPasswordVisible((prev) => !prev)}
              >
                <FontAwesome
                  name={isCurrentPasswordVisible ? "eye-slash" : "eye"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View className="flex-row items-center gap-2">
              <TextInput
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                className="flex-1 bg-[#313384]/50 p-3 rounded-xl text-white mb-4 border border-[#CACCFD]/50"
                placeholderTextColor="rgba(255,255,255,0.5)"
                placeholder="Enter new password"
                secureTextEntry={!isNewPasswordVisible}
              />
              <TouchableOpacity
              className="mb-2"
                onPress={() => setIsNewPasswordVisible((prev) => !prev)}
              >
                <FontAwesome
                  name={isNewPasswordVisible ? "eye-slash" : "eye"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-fit ml-[50%] h-[30px] bg-[#e3e3e3] rounded-xl items-center justify-center"
              onPress={handleSaveNewPassword}
            >
              <Text className="text-black font-semibold">
                Save new password
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-4 my-5">
            <Text className="text-white font-semibold">Danger zone</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="bg-red-400 p-3 w-fit m-auto px-6 rounded-2xl flex-row items-center gap-2 shadow-lg"
            >
              <Text className="text-white font-medium">Delete account!</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2 py-5">
            <TouchableOpacity
              onPress={() => handleLogout()}
              className="bg-blue-400 w-full p-3 text-center px-6 rounded-2xl flex-row gap-2 shadow-lg"
            >
              <Text className="text-white m-auto font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserInfo;
