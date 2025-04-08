import { fProject } from "@/fakedb";
import { fUser } from "@/fakedb";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
const user = fUser;
const project = fProject;

// Component chính cho Dashboard
const Dashboard = () => {
  const time = new Date().getHours();
  const greeting =
    time < 12 ? "Good Morning" : time < 18 ? "Good Afternoon" : "Good Evening";
  useEffect(() => {
    const getUser = async () => {
      const user = await SecureStore.getItemAsync("user");
      if (!user) {
        router.push("/login");
      }
    };
    getUser();
  }, []);

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

      {/* Phần header với thông tin người dùng */}
      <View className="flex-row justify-between items-center p-6 mt-10">
        <View className="flex-row items-center gap-4">
          <Image
            source={
              user.avatar
                ? { uri: user.avatar }
                : require("../../assets/images/placeholderAva.jpg")
            }
            className="w-16 h-16 rounded-full bg-white"
          />
          <View>
            <Text className="text-white text-xl font-bold">
              {user.username || "Set up your profile"}
            </Text>
            <Text className="text-gray-300">{greeting}</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity className="bg-[#313384] p-2 rounded-2xl border-4 border-[#CACCFD]">
            <AntDesign name="bells" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push("/userInfo")} className="bg-[#313384] p-2 rounded-2xl border-4 border-[#CACCFD]">
            <Feather name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách các hoạt động */}
      <View className="flex-1 bg-white rounded-t-[40px] mt-6 p-6">
        <Text className="text-[#1D2760] text-xl font-bold mb-4">
          Your Activity
        </Text>
            
        {project.length > 0 ? (
          project.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-[#F5F6FA] p-4 py-4 rounded-2xl mb-4 flex-row h-fit justify-between items-center"
            >
              <View className="flex-row items-center gap-4">
                <Image
                  source={
                    item.avatar
                      ? { uri: item.avatar }
                      : require("../../assets/images/placeholderAva.jpg")
                  }
                  className="w-16 h-16 rounded-xl"
                />
                <View className="flex flex-col gap-2">
                  <Text className="text-[#1D2760] font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500">{item.created_at}</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-[#2f3f96] p-2 px-4 rounded-xl">
                <Text className="text-white">View</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
         <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-gray-500 text-lg font-medium">No project yet</Text>
          <Text className="text-gray-500">Create your first project</Text>
          <TouchableOpacity className="bg-[#2f3f96] p-3 px-6 rounded-xl flex-row items-center gap-2">
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white font-medium">Create Project</Text>
          </TouchableOpacity>
         </View>
        )}
      </View>
    </View>
  );
};

export default Dashboard;
