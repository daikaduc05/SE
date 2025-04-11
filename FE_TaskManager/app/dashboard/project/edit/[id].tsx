import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import BackButton from "@/common/BackButton";
import CalendarPicker from "@/common/CalenderHeader";
import Toggle from "@/common/Toggle";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";

// Component chỉnh sửa dự án
const EditProject = () => {
  // Các state quản lý thông tin dự án
  const { id } = useLocalSearchParams(); // Assuming `id` is passed as a parameter
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [isLimitDate, setIsLimitDate] = useState(false);

  // Fetch the project data by ID (simulating here with a mock project)
  useEffect(() => {
    // Fetch existing project data by id (replace this with an actual API call)
    const existingProject = {
      projectName: "Project A",
      description: "Description of Project A",
      members: ["user1@gmail.com", "user2@gmail.com"],
      endDate: "2025-12-31",
      isLimitDate: true,
    };
    setProjectName(existingProject.projectName);
    setDescription(existingProject.description);
    setMembers(existingProject.members);
    setDate(existingProject.endDate);
    setIsLimitDate(existingProject.isLimitDate);
  }, [id]);

  // Hàm thêm thành viên mới
  const handleAddMember = () => {
    if (memberEmail && !members.includes(memberEmail) && memberEmail.includes("@gmail.com")) {
      setMembers([...members, memberEmail]);
      setMemberEmail("");
    }
    else {
      ToastAndroid.show("Invalid email", ToastAndroid.SHORT);
    }
  };

  // Hàm xử lý cập nhật dự án
  const handleUpdateProject = () => {
    if (projectName === "" || description === "" || members.length === 0) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
    } else {
      // Handle project update logic here
      console.log("Updated Project:", {
        projectName,
        description,
        members,
        date,
        isLimitDate,
      });
      router.back(); // Go back to the previous screen
    }
  };

  return (
    <View className="flex-1 bg-[#1D2760]">
      {/* Nền gradient */}
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />

      {/* Header với nút quay lại */}
      <BackButton />
      <View className="flex-row items-center mx-auto h-fit p-3 my-10 w-fit px-5 bg-[#496FCF] rounded-full">
        <Text className="text-white text-xl font-bold ">
          Edit Project
        </Text>
      </View>

      {/* Form chỉnh sửa dự án */}
      <ScrollView className="flex-1 bg-[#1D2760] rounded-t-[40px] px-6 py-8">
        <View className="flex-col mt-4 gap-6">
          {/* Tên dự án */}
          <View className="flex-col gap-2">
            <Text className="text-white text-lg mb-2">Project Name</Text>
            <TextInput
              className="bg-[#313384] text-white p-4 rounded-full"
              placeholder="Enter project name..."
              placeholderTextColor="#9EA4CB"
              value={projectName}
              onChangeText={setProjectName}
            />
          </View>

          {/* Ngày kết thúc */}
          <View className="flex-row items-center justify-between my-3 gap-5">
            <Text className="text-white text-lg mb-2">End Date</Text>
            <Toggle value={isLimitDate} onValueChange={setIsLimitDate} />
          </View>
          {
            isLimitDate && (
              <CalendarPicker date={date} onDateChange={setDate} />
            )
          }

          {/* Thêm thành viên */}
          <View className="flex-col gap-2">
            <Text className="text-white text-lg mb-2">Add Members</Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 bg-[#313384] text-white p-4 rounded-full"
                placeholder="Enter member email..."
                placeholderTextColor="#9EA4CB"
                value={memberEmail}
                onChangeText={setMemberEmail}
              />
              <TouchableOpacity
                onPress={handleAddMember}
                className="bg-[#2f3f96] p-4 rounded-full"
              >
                <AntDesign name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Danh sách thành viên đã thêm */}
            <View className="mt-2">
              {members.map((email, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between bg-[#313384] p-4 rounded-full mt-2"
                >
                  <Text className="text-white">{email}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newMembers = [...members];
                      newMembers.splice(index, 1);
                      setMembers(newMembers);
                    }}
                  >
                    <AntDesign name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Mô tả dự án */}
          <View className="flex-col gap-2">
            <Text className="text-white text-lg mb-2">Project Description</Text>
            <TextInput
              className="bg-[#313384] text-white p-4 rounded-full"
              placeholder="Enter project description..."
              placeholderTextColor="#9EA4CB"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Nút cập nhật dự án */}
          <View className="flex-row justify-between gap-2 pb-14">
          <TouchableOpacity
            onPress={()=>router.back()}
            className="bg-[#E26D90] p-4 rounded-full mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdateProject}
            className="bg-[#8D8CC3] p-4 rounded-full mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">
              Update Project
            </Text>
          </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProject;
