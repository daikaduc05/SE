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
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { IEditUser, IProjects_member } from "@/model/IProjects";
import { IAddUser } from "@/model/IUser";
import { jwtDecode } from "jwt-decode";

// Component chỉnh sửa dự án
const EditProject = () => {
  // Các state quản lý thông tin dự án
  const { id } = useLocalSearchParams<{ id: string }>(); // Assuming `id` is passed as a parameter
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [endDate, setEndDate] = useState<string>();
  const [isLimitDate, setIsLimitDate] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [membersList, setMembersList] = useState<IEditUser[]>([]);
  const [members, setMembers] = useState<IAddUser[]>([]);
  const [createby, setcreateby] = useState<string>("");

  // Fetch the project data by ID (simulating here with a mock project)
  useEffect(() => {
    // Fetch existing project data by id (replace this with an actual API call)
    const fetching = async () => {
      const token = (await SecureStore.getItemAsync("token")) as string;
      const decoded = jwtDecode<{ id: string; email: string }>(token);
      setcreateby(decoded.email);
      const createBy = {
        email: decoded.email,
        roleName: ["admin", "user"],
      };
      if (!members.map((m) => m.email).includes(createBy.email)) {
        setMembers((prevMembers) => [...prevMembers, createBy]);
      }
    };
    fetching();

    const fetchProjectDetail = async () => {
      const token = (await SecureStore.getItemAsync("token")) as string;
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

        if (res.data.endDate) {
          setIsLimitDate(true);
          setEndDate(res.data.endDate);
        }
        setProjectName(res.data.name);
        setDescription(res.data.description);
        setStartDate(res.data.startDate);
        // console.log(res.data);

        const emails = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Project members:", emails.data);
      
        const memberEdit: IEditUser[] = emails.data.flatMap((item: IProjects_member) =>
          item.roles.map((role) => ({
            email: item.email,
            roleName: role,
          }))
        );
        setMembersList(memberEdit);
        // console.log("Project members:", memberEdit);
        // console.log("Project membersss2:", emails.data);
        setMembers(
          emails.data.map((item: any) => {
            return {
              roleName: item.roles,
              email: item.email,
            };
          })
        );
        // console.log("mim bowf:", members);
      } catch (error) {
        ToastAndroid.show(
          "Error fetching project details. Please try again later.",
          ToastAndroid.SHORT
        );
        console.log("Error fetching project details:", error);
      }
    };
    fetchProjectDetail();
  }, [id]);

  // Hàm thêm thành viên mới
  const handleAddMember = () => {
    const memberEmails = members.map((member) => member.email);
    if (
      memberEmail &&
      !memberEmails.includes(memberEmail) &&
      memberEmail.includes("@gmail.com")
    ) {
      setMembers([...members, { email: memberEmail, roleName: ["user"] }]);
      setMembersList([...membersList, { email: memberEmail, roleName: "user" }]);  
      setMemberEmail("");
    } else {
      ToastAndroid.show("Invalid email", ToastAndroid.SHORT);
    }
  };

  // Hàm xử lý cập nhật dự án
  const handleUpdateProject = async () => {
    if (projectName === "" || description === "" || membersList.length === 0) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
    } else {
      // Handle project update logic here
      const token = (await SecureStore.getItemAsync("token")) as string;
      try {
        const res = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${id}`,
          {
            name: projectName,
            description: description,
            endDate: isLimitDate
              ? dayjs(endDate).toISOString()
              : dayjs("2999-12-30T17:33:58.292Z").toISOString(),
            startDate: dayjs(startDate).toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("data:", membersList);

        const member = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${id}/members`,
          {
            membersList: membersList,
          },
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync(
                "token"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res && member) {
          // console.log("Project updated successfully");
          // console.log("Member updated successfully:", member.data);
          ToastAndroid.show("Project updated successfully", ToastAndroid.SHORT);
          router.replace({
            pathname: "/dashboard/project/[project]",
            params: { project: id, refresh: "true" },
          });
        }
      } catch (error) {
        console.log("Error updating project:", error);
      }
    }
  };

  const handleAssignRole = (email: IAddUser) => {
    if (email.email === createby) {
      ToastAndroid.show("You can't change your own role", ToastAndroid.SHORT);
      return;
    }
  
    const updatedMembers = members.map((member) => {
      if (member.email === email.email) {
        const isAdmin = member.roleName.includes("admin");
  
        const newRoles = isAdmin ? ["user"] : ["admin", "user"];
  
        // Cập nhật danh sách editUser
        setMembersList((prev) => {
          const exists = prev.find(
            (item) => item.email === email.email && item.roleName === "admin"
          );
  
          if (!isAdmin && !exists) {
            // THÊM admin nếu chưa có
            return [...prev, { email: email.email, roleName: "admin" }];
          } else if (isAdmin && exists) {
            // XÓA admin nếu đang có
            return prev.filter(
              (item) =>
                !(item.email === email.email && item.roleName === "admin")
            );
          }
          return prev;
        });
  
        return { ...member, roleName: newRoles };
      }
      return member;
    });
  
    setMembers(updatedMembers);
  //  console.log("membersList", membersList);
  };
  
  
  const handledeleteMember = (email: string) => {
    if(email === createby) {
      ToastAndroid.show(
        "You can't remove yourself",
        ToastAndroid.SHORT
      );
      return;
    }
    const newMembers = members.filter((m) => m.email !== email);
    setMembers(newMembers);
    const newMembersList = membersList.filter((m) => m.email !== email);
    setMembersList(newMembersList);
    // console.log("membersList", membersList);
  }

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
        <Text className="text-white text-xl font-bold ">Edit Project</Text>
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
          {isLimitDate && (
            <CalendarPicker
              date={dayjs(endDate).toISOString()}
              onDateChange={(date) => {
                setEndDate(date);
              }}
            />
          )}

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
                  <TouchableOpacity
                  onPress={() => {handledeleteMember(email.email)}}
                  >
                    <AntDesign name="close" size={24} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white">{email.email}</Text>
                  <View className="flex-row flex-wrap gap-2 w-[100px] justify-end">
                    {email.roleName.map((role, roleIndex) => (
                      <View key={roleIndex}>
                        <Text
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            role.includes("admin")
                              ? "text-white bg-red-500"
                              : "text-white bg-blue-500"
                          }`}
                        >
                          {role.toUpperCase()}
                        </Text>
                      </View>
                    ))}

                    {/* Nếu không có role user hoặc admin */}
                  </View>
                  <TouchableOpacity onPress={() => handleAssignRole(email)}>
                    {email.roleName.includes("admin") ? (
                      <AntDesign name="downcircle" size={24} color="blue-500" />
                    ) : (
                      <AntDesign name="upcircle" size={24} color="red" />
                    )}
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
              onPress={() => router.back()}
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
