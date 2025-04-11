import React from "react";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackButton from "@/common/BackButton";
import { router, useLocalSearchParams } from "expo-router";

// Bạn có thể thay đổi mảng email ở đây
const emailList = ["duecgay1@gmail.com", "taismiez@gmail.com"];

const DetailProject = () => {
  // Các thông tin sự kiện
  const { id } = useLocalSearchParams();
  const projectName = "Tam thai tu team";
  const startTime = "24/3/2025";
  const endTime = "25/3/2025";
  const description =
    "This project focuses on developing an innovative solution to optimize internal workflows and enhance team performance. Through needs analysis, technical proposals, and thorough planning, it aims to deliver sustainable value while strengthening professional skills and fostering a collaborative spirit among team members.";

  return (
    <LinearGradient colors={["#252850", "#252850"]} className="flex-1 pb-10">
      {/* Nút quay lại */}
      <BackButton />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-[#1D2760] pb-20"
      >
        {/* Nội dung chính */}
        <View className="flex-1 pt-10  mt-4 px-5">
          {/* Tiêu đề */}

          {/* Tên event có gạch ngang hai bên */}
          <View className="flex-row justify-between w-full items-center mb-5">
            <View className="h-1 bg-white w-[20%]" />
            <Text className="text-white bg-[#5C5ADB] rounded-full text-xl font-bold px-4 py-2 mx-2">
              {projectName}
            </Text>
            <View className="h-1 bg-white w-[20%]" />
          </View>

          {/* Thời gian bắt đầu */}
          <View className="flex-row bg-[#5C5ADB] rounded-full justify-between items-center mb-3 p-2 px-4 mt-2">
            <Text className="text-white rounded-full text-lg font-bold py-2">
              Beginning of Event
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text className="text-white pl-2">{startTime}</Text>
            </View>
          </View>

          {/* Thời gian kết thúc */}
          <View className="flex-row bg-[#5C5ADB] rounded-full justify-between items-center mb-5 p-2 px-4">
            <Text className="text-white rounded-full text-lg font-bold py-2">
              Completion date
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text className="text-white pl-2">{endTime}</Text>
            </View>
          </View>

          {/* Danh sách thành viên */}
          <View className="mb-5 mt-4">
            <View className="flex-row items-start gap-2">
              <Text className="text-white text-lg flex-row items-center gap-2 font-semibold mb-2">
                Member's list
              </Text>
              <FontAwesome6 name="people-group" size={24} color="white" />
            </View>
            <View className="flex-col mt-2 gap-4 items-start">
              {emailList.map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-white bg-[#5C5ADB] rounded-full text-lg font-bold px-4 py-2">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mô tả sự kiện */}
          <View className="mb-5">
            <Text className="text-white text-lg font-semibold mb-2">
              Event's description
            </Text>
            <Text className="text-white p-4 bg-[#5C5ADB] rounded-lg text-lg">
              {description}
            </Text>
          </View>

          {/* Nút chỉnh sửa */}
          <View className="flex-row items-center justify-between mt-4 px-2">
            <TouchableOpacity
              className="flex-row items-start justify-center bg-[#5f5f5f] rounded-full px-4 py-2 gap-2 mt-4"
              onPress={() => router.back()}
            >
              <AntDesign name="back" size={24} color="white" />
              <Text className="text-white text-lg font-semibold mb-2">
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-center bg-[#F39C12] rounded-full px-4 py-4 mt-4 "
              onPress={() => router.push(`/dashboard/project/edit/${id}`)}
            >
              <AntDesign name="edit" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-2">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailProject;
