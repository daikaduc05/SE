import { fUser } from "@/fakedb";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableOpacity, Image, TextInput } from "react-native";
import * as SecureStore from "expo-secure-store";

// Component chính cho trang UserInfo
const UserInfo = () => {
  const [username, setUsername] = useState(fUser.username);
  const [notifications, setNotifications] = useState(fUser.noti_setting);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user");
    router.push("/login");
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

      {/* Header với nút back */}
      <View className="flex-row items-center p-6 mt-10">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Profile Setting</Text>
      </View>

      {/* Phần chính */}
      <View className="flex-1 bg-[#1D2760] rounded-t-[40px] mt-6 p-6">
        {/* Phần avatar */}
        <View className="items-center mb-8">
          <Image
            source={
              fUser.avatar
                ? { uri: fUser.avatar }
                : require("../../assets/images/placeholderAva.jpg")
            }
            className="w-24 h-24 rounded-full bg-white mb-2"
          />
          <TouchableOpacity>
            <Text className="text-white">Choose photo</Text>
          </TouchableOpacity>
        </View>

        {/* Profile setting */}
        <View className="mb-8">
          <Text className="text-white mb-2">Enter new name</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="bg-white/20 p-3 rounded-xl text-white mb-4"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />

          {/* Notifications toggle */}
          <View className="flex-row justify-between items-center">
            <Text className="text-white">Notifications</Text>
            <TouchableOpacity
              onPress={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full ${
                notifications ? "bg-green-500" : "bg-gray-500"
              } justify-center px-1`}
            >
              <View
                className={`w-4 h-4 rounded-full bg-white ${
                  notifications ? "ml-6" : "ml-0"
                }`}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Change password */}
        <View className="mb-8">
          <Text className="text-white mb-2">Current password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            className="bg-white/20 p-3 rounded-xl text-white mb-4"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />

          <Text className="text-white mb-2">New password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            className="bg-white/20 p-3 rounded-xl text-white mb-4"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />

          <TouchableOpacity className="bg-[#2f3f96] p-3 px-6 rounded-xl flex-row items-center gap-2">
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;
       

