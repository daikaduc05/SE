import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import BackButton from "@/common/BackButton";
import { IProjects_Detail, IProjects_member } from "@/model/IProjects";
import { IAddUser } from "@/model/IUser";

// Dummy member list (thay bằng API nếu cần)

const DetailProject = () => {
  const { id } = useLocalSearchParams();
  const [projectDetailt, setProjectDetailt] = useState<IProjects_Detail>();
  const [emailList, setEmailList] = useState<IProjects_member[]>([]);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync(
                "token"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProjectDetailt(res.data);
        const emails = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/members`,
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync(
                "token"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEmailList(emails.data);
        console.log("Project members:", emailList);
      } catch (error) {
        ToastAndroid.show(
          "Error fetching project details. Please try again later.",
          ToastAndroid.SHORT
        );
        console.log("Error fetching project details:", error);
      }
    };
    fetchProjectDetail();
  }, []);

  const renderDateCard = (label: string, date: string) => (
    <View className="bg-[#353A70] rounded-xl px-4 py-3 mb-4 flex-row justify-between items-center">
      <Text className="text-white text-base font-semibold">{label}</Text>
      <View className="flex-row items-center gap-2">
        <Ionicons name="calendar-outline" size={18} color="white" />
        <Text className="text-white text-sm">
          {dayjs(date).format("YYYY-MM-DD")}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#252850", "#252850"]} className="flex-1">
      <BackButton />
      <ScrollView className="flex-1 px-5 pt-4 pb-10 mt-16">
        {/* Tiêu đề */}
        <View className="items-center mb-6">
          <Text className="text-white text-2xl font-bold tracking-wide">
            {projectDetailt?.name}
          </Text>
          <View className="h-[2px] w-16 bg-white mt-2 rounded-full" />
        </View>

        {/* Thời gian bắt đầu & kết thúc */}
        {renderDateCard(
          "Beginning of Event",
          dayjs(projectDetailt?.startDate).toISOString() ?? ""
        )}
        {renderDateCard(
          "Completion Date",
          dayjs(projectDetailt?.endDate).toISOString() ?? ""
        )}

        {/* Danh sách thành viên */}
        <View className="mb-6 mt-4">
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome6 name="people-group" size={20} color="white" />
            <Text className="text-white text-base font-semibold">Members</Text>
          </View>
          <View className="flex-col gap-3">
            {emailList.map((user) => (
              <View
                key={user.email}
                className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm border border-gray-200"
              >
                <Text className="text-base font-semibold text-black">
                  {user.email}
                </Text>

                <View className="flex-row flex-wrap mt-2 gap-2">
                  {user.roles.map((role) => (
                    <View
                      key={role}
                      className={`rounded-full px-3 py-1 ${
                        role.toLowerCase().includes("admin")
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      <Text className="text-white text-sm font-semibold">
                        {role.toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Mô tả */}
        <View className="mb-6">
          <Text className="text-white text-base font-semibold mb-2">
            Event's Description
          </Text>
          <Text className="bg-[#353A70] text-white p-4 rounded-xl text-sm leading-relaxed">
            {projectDetailt?.description || "No description"}
          </Text>
        </View>
      </ScrollView>

      {/* Nút hành động */}
      <View className="flex-row justify-between items-center px-6 pb-6">
        <TouchableOpacity
          className="flex-row items-center bg-gray-600 rounded-full px-4 py-2 gap-2"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text className="text-white font-medium">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-[#F39C12] rounded-full px-4 py-2 gap-2"
          onPress={() => router.push(`/dashboard/project/edit/${id}`)}
        >
          <AntDesign name="edit" size={20} color="white" />
          <Text className="text-white font-bold">Edit</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default DetailProject;
