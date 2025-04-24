import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  Modal,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import ClockLive from "@/common/ClockLive";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/model/IUser";
import axios from "axios";
import { IProjects_Info } from "@/model/IProjects";
import { useLocalSearchParams } from "expo-router";
import { useNotification } from "@/context/NotificationContext";


// Component chính cho Dashboard
const Dashboard = () => {
  const { refresh } = useLocalSearchParams();
  const [userInfo, setUSerInfo] = useState<IUser>();
  const [listProject, setListProject] = useState<IProjects_Info[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string>("");
  const { setIsNotificationEnabled} = useNotification()
 
  

  // Fetch user and project data
  useEffect(() => {
    const getUser = async () => {
      const token = (await SecureStore.getItemAsync("token")) as string;
      const decoded = jwtDecode<{ id: string }>(token); 
      // console.log("Token:", token);
        if (!token) {
          ToastAndroid.show("Please login", ToastAndroid.SHORT);
        alert("Please login");
        router.push("/login");
        return;
      } else {  
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
          if (res.data) {
            setUSerInfo(res.data);
            setIsNotificationEnabled(res.data.notiSettings)
          }
          if (res) {
            console.log(
              `Get user: ,${process.env.EXPO_PUBLIC_API_URL}/users/${decoded.id}`
            );
          }
          const project = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/projects`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(project.data);
          setListProject(project.data);
          if (project) {
            console.log(
              `Get project: ,${process.env.EXPO_PUBLIC_API_URL}/projects`
            );
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
          ToastAndroid.show("An error occurred", ToastAndroid.SHORT);
        }
      }
    };

    getUser();
  }, [refresh]);

  // Function to handle project deletion
  const handleDelete = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("Deleting project with ID:", projectIdToDelete);
      const res = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/projects/${projectIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res) {
        // Close the modal and refresh the project list
        setModalVisible(false);
        router.push({
          pathname: "/dashboard",
          params: { refresh: "true" },
        });
        console.log("Project deleted successfully:", res.data);
      }
    } catch (error) {
      console.log("Error deleting project:", error);
      ToastAndroid.show("Error deleting project", ToastAndroid.SHORT);
    }
  };

  // Function to handle opening the delete modal
  const openDeleteModal = (id: string) => {
    setProjectIdToDelete(id); // Set the project ID to delete
    setModalVisible(true); // Show the modal
  };

  const time = new Date().getHours();
  const greeting =
    time < 12 ? "Good Morning" : time < 18 ? "Good Afternoon" : "Good Evening";

 

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

      {/* Header with user info */}
      <View className="flex-row justify-between items-center p-6 mt-10">
        <View className="flex-row items-center gap-4">
          <Image
            source={
              userInfo?.avatar
                ? { uri: userInfo.avatar }
                : require("../../assets/images/placeholderAva.jpg")
            }
            className="w-16 h-16 rounded-full bg-white"
          />
          <View>
            <Text className="text-white text-xl font-bold">
              {userInfo?.name || "Set up your profile"}
            </Text>
            <Text className="text-gray-300">{greeting}</Text>
          </View>
        </View>
        <View className="flex-row gap-3">
          <ClockLive />
        </View>
      </View>

      {/* Create new project button */}
      <View className="flex-row gap-2 items-end mb-5 mx-5 justify-between">
        <TouchableOpacity
          onPress={() => router.push("/dashboard/project/create")}
          activeOpacity={0.85}
          className="bg-[#313384] px-6 py-4 rounded-full border-2 border-[#cdcdcd] shadow-2xl flex-row items-center justify-center"
        >
          <Text className="text-white text-lg font-semibold tracking-wide">
            Create New
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-start gap-4 mt-4 justify-center">
          {/* Nút Notifications */}
          <TouchableOpacity
            onPress={() => router.push("/userInfo/nofitication")}
            
            className="bg-[#313384] p-4 rounded-full border-2 border-[#cdcdcd] shadow-xl"
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          

          {/* Nút Settings */}
          <TouchableOpacity
            onPress={() => router.push("/userInfo")}
            className="bg-[#313384] p-4 rounded-full border-2 border-[#cdcdcd] shadow-xl"
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Project list */}
      <ScrollView className="flex-1 bg-[#1D2760]/80 rounded-t-[40px]">
        <View className="flex-1 rounded-t-[40px] mt-2 p-6">
          {listProject ? (
            listProject.map((item, index) => (
              <View
                key={index}
                className={`bg-[#F5F6FA] p-4 py-4 rounded-2xl mb-4 flex-row h-fit justify-between items-center`}
              >
                <View className="flex flex-col gap-2">
                  <Text className="text-[#1D2760] font-semibold">
                    {item.name}
                  </Text>
                  <View
                    className={`flex-row gap-2 items-center ${
                      !item.startDate || !item.endDate ? "hidden" : ""
                    }`}
                  >
                    <Text className="text-gray-500">
                      {item.startDate
                        ? new Date(item.startDate)?.toLocaleDateString()
                        : ""}
                    </Text>
                    <AntDesign name="arrowright" size={14} color="black" />
                    <Text className="text-gray-500">
                      {item.endDate
                        ? new Date(item.endDate)?.toLocaleDateString()
                        : ""}
                    </Text>
                  </View>
                  <Text
                    className={`w-[70px] text-center rounded-full py-1 ${
                      item.roles.includes("admin")
                        ? "text-white bg-red-500 font-semibold"
                        : "text-white bg-blue-500 font-medium"
                    }`}
                  >
                    {item.roles.includes("admin") ? "Admin" : "Member"}
                  </Text>
                </View>

                {/* Action buttons */}
                <View className="flex-col gap-2 items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/dashboard/project/[project]",
                        params: { project: item.id },
                      })
                    }
                    className="bg-[#2f3f96] p-2 px-4 rounded-xl"
                  >
                    <Text className="text-white">View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => openDeleteModal(item.id)}
                    className="bg-[#B91C1C] p-2 px-4 rounded-xl"
                  >
                    <Text className="text-white">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-col justify-end items-center gap-4 my-20">
              <Text className="text-gray-500 text-xl font-medium">
                No project yet
              </Text>
              <Text className="text-gray-500 text-lg">
                Create your first project
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/dashboard/project/create")}
                className="bg-[#2f3f96] p-3 px-6 rounded-xl flex-row items-center gap-2 mt-2"
              >
                <AntDesign name="plus" size={20} color="white" />
                <Text className="text-white font-medium">Create now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal Confirm Delete */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl mx-5 flex-col gap-10">
            <Text className="text-lg font-semibold mb-4">
              Are you sure you want to delete this project?
            </Text>
            <View className="flex-row gap-4 w-full justify-between">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="bg-gray-500 p-4 rounded-xl"
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                className="bg-red-500 p-4 rounded-xl"
              >
                <Text className="text-white">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;
