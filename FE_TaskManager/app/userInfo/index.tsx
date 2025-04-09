import { fUser } from "@/fakedb";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Animated from "react-native-reanimated";
import axios from "axios";
import ImagePickerExample from "@/common/imagePicker";
import BackButton from "@/common/BackButton";

const user = fUser;
// Component chính cho trang UserInfo
const UserInfo = () => {
  const [username, setUsername] = useState<string>(fUser.username);
  const [avatar, setAvatar] = useState<string>(fUser.avatar);
  const [notifications, setNotifications] = useState<boolean>(
    fUser.noti_setting
  );
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [trueCurrentPassword, setTrueCurrentPassword] =
    useState<boolean>(false);

  const handleSaveChanges = async () => {
    const user = {
      username: username,
      noti_setting: notifications,
    };
    const res = await axios.put(`http://localhost:3000/users/${username}`, user);
    if(res){
      ToastAndroid.show("Changes saved successfully", ToastAndroid.SHORT);
    }
    else{
      ToastAndroid.show("Changes saved failed", ToastAndroid.SHORT);
    }
    console.log(username);
    console.log(notifications);

  };

  const handleSaveNewPassword = async () => {
    if (currentPassword === fUser.password) {
      const user = {
        password: newPassword,
      };
      const res = await axios.put(
        `http://localhost:3000/users/${username}`,
        user
      );
      ToastAndroid.show(
        "Password changed successfully, please login again",
        ToastAndroid.SHORT
      );
      setCurrentPassword("");
      setNewPassword("");

      if (res) {
        router.push("/dashboard");
      }
    } else {
      ToastAndroid.show("Current password is incorrect", ToastAndroid.SHORT);
      setTrueCurrentPassword(false);
    }
    console.log(currentPassword);
    console.log(newPassword);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const res = await axios.delete(`http://localhost:3000/users/${username}`);
    if (res) {
      router.push("/login");
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
          <ImagePickerExample setImage={setAvatar} />
        </View>

        {/* Profile setting */}
        <View className="mb-8 flex-col gap-2">
          <Text className="text-white mb-4  font-semibold ">
            Enter new name
          </Text>
          <TextInput
            value={username}
            onChangeText={(text)=>setUsername(text)}
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
            <View className="flex-row items-center gap-2">
              <TextInput
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
                className="bg-[#313384]/50 p-3 rounded-xl text-white mb-4 w-full border border-[#CACCFD]/50"
                placeholderTextColor="rgba(255,255,255,0.5)"
                placeholder="Enter current password"
              />
            </View>
            <View className="flex-row items-center gap-2">
              <TextInput
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                className="bg-[#313384]/50 p-3 rounded-xl text-white mb-4 w-full border border-[#CACCFD]/50"
                placeholderTextColor="rgba(255,255,255,0.5)"
                placeholder="Enter new password"
              />
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
              onPress={() => handleDeleteAccount()}
              className="bg-red-400 p-3 w-fit m-auto px-6 rounded-2xl flex-row items-center gap-2 shadow-lg"
            >
              <Text className="text-white font-medium">Delete account!</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2 py-5">
            <TouchableOpacity onPress={()=>handleLogout()} className="bg-blue-400 w-full p-3 text-center px-6 rounded-2xl flex-row gap-2 shadow-lg">
              <Text className="text-white m-auto font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserInfo;
