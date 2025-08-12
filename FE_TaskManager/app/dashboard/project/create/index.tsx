import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import axios from "axios";
import { IAddUser } from "@/model/IUser";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { IEditUser } from "@/model/IProjects";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<IAddUser[]>([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [isLimitDate, setIsLimitDate] = useState(false);
  const [createby, setcreateby] = useState<string>("");
  const [memberCreate, setMemberCreate] = useState<IEditUser[]>([]);
  const [enable, setEnable] = useState(true);

  const updateMemberCreateList = (membersList: IAddUser[]) => {
    const result: IEditUser[] = membersList.flatMap((item) =>
      item.roleName.map((role) => ({
        email: item.email,
        roleName: role,
      }))
    );
    setMemberCreate(result);
  };

  useEffect(() => {
    console.log("memberCreate", memberCreate);
  }, [memberCreate]);

  useEffect(() => {
    const fetching = async () => {
      const token = (await SecureStore.getItemAsync("token")) as string;
      const decoded = jwtDecode<{ id: string; email: string }>(token);
      setcreateby(decoded.email);
      const createBy = {
        email: decoded.email,
        roleName: ["admin", "user"],
      };
      if (!members.map((m) => m.email).includes(createBy.email)) {
        const updated = [...members, createBy];
        setMembers(updated);
        updateMemberCreateList(updated);
      }
    };
    fetching();
  }, []);

  const handleAddMember = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (
      emailRegex.test(memberEmail) &&
      !members.map((m) => m.email).includes(memberEmail)
    ) {
      const updated = [...members, { email: memberEmail, roleName: ["user"] }];
      setMembers(updated);
      updateMemberCreateList(updated);
      ToastAndroid.show("Member added successfully", ToastAndroid.SHORT);
      setMemberEmail("");
    } else {
      ToastAndroid.show(
        "Invalid email or email already exists",
        ToastAndroid.SHORT
      );
    }
  };

  const handleAssignRole = (email: IAddUser) => {
    const updatedMembers = members.map((member) => {
      if (member.email === email.email && email.email !== createby) {
        const newRole = member.roleName.includes("admin")
          ? ["user"]
          : ["admin", "user"];
        return { ...member, roleName: newRole };
      }
      return member;
    });
    setMembers(updatedMembers);
    updateMemberCreateList(updatedMembers);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
    updateMemberCreateList(newMembers);
  };

  const handleCreateProject = async () => {
    setEnable(false);
    if (projectName === "" || description === "" || members.length === 0) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      setEnable(true);
    } else if (isLimitDate && dayjs(date).isBefore(dayjs())) {
      ToastAndroid.show("End date must be after today", ToastAndroid.SHORT);
      setEnable(true);
    } else if (!members.some((item) => item.roleName.includes("admin"))) {
      ToastAndroid.show("At least one admin is required", ToastAndroid.SHORT);
      setEnable(true);
    } else {
      try {
        const token = (await SecureStore.getItemAsync("token")) as string;
        const deadline = isLimitDate
          ? dayjs(date).toISOString()
          : dayjs("2999-12-20").toISOString();

        const res = await axios.post(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/projects`,
          {
            name: projectName,
            description: description,
            endDate: deadline,
            startDate: dayjs().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (memberCreate.length === 0) {
          ToastAndroid.show("Please add members", ToastAndroid.SHORT);
          return;
        }

        await axios.put(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/projects/${res.data.id}/members`,
          {
            membersList: memberCreate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        ToastAndroid.show("Project created successfully", ToastAndroid.SHORT);
        router.replace({
          pathname: "/dashboard",
          params: { refresh: "true" },
        });
        
      } catch (error: any) {
        console.log("Error creating project:", error?.response?.data || error);
        setEnable(true);
        ToastAndroid.show("Failed to create project", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View className="flex-1 bg-[#1D2760]">
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />

      <BackButton />
      <View className="flex-row items-center mx-auto my-10 px-5 bg-[#496FCF] rounded-full">
        <Text className="text-white text-xl font-bold py-3">
          Create New Project
        </Text>
      </View>

      <ScrollView className="flex-1 bg-[#1D2760] rounded-t-[40px] px-6 py-8">
        <View className="flex-col mt-4 gap-6">
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

          <View className="flex-row items-center justify-between my-3 gap-5">
            <Text className="text-white text-lg mb-2">End Date</Text>
            <Toggle value={isLimitDate} onValueChange={setIsLimitDate} />
          </View>
          {isLimitDate && <CalendarPicker date={date} onDateChange={setDate} />}

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

            <View className="mt-2">
              {members.map((email, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between bg-[#313384] p-4 rounded-full mt-2"
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (email.email === createby) {
                        ToastAndroid.show(
                          "You can't remove yourself",
                          ToastAndroid.SHORT
                        );
                        return;
                      }
                      handleRemoveMember(index);
                    }}
                  >
                    <AntDesign name="close" size={20} color="white" />
                  </TouchableOpacity>

                  <Text className="text-white font-medium">{email.email}</Text>

                  <View className="flex-row flex-wrap gap-2 w-[100px] justify-end">
                    {email.roleName.map((role, roleIndex) => (
                      <Text
                        key={roleIndex}
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          role.includes("admin")
                            ? "text-white bg-red-500"
                            : "text-white bg-blue-500"
                        }`}
                      >
                        {role.toUpperCase()}
                      </Text>
                    ))}
                  </View>

                  <TouchableOpacity onPress={() => handleAssignRole(email)}>
                    {email.roleName.includes("admin") ? (
                      <AntDesign name="downcircle" size={24} color="blue" />
                    ) : (
                      <AntDesign name="upcircle" size={24} color="red" />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

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

          <TouchableOpacity
            onPress={handleCreateProject}
            disabled={!enable}
            className="bg-[#2f3f96] p-4 rounded-full mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">
              Create Project
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateProject;
