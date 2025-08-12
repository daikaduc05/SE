import BackButton from "@/common/BackButton";
import CalendarPicker from "@/common/CalenderHeader";
import { Entypo, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { IProjects_member } from "@/model/IProjects";

const priority = ["Medium", "Important", "Warning"];

const EditTask = () => {
  const { id } = useLocalSearchParams() as { id: string };
  const { project } = useLocalSearchParams() as { project: string };
  const [taskName, setTaskName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [memberTask, setMemberTask] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [prioritySelect, setPrioritySelect] = useState("");
  const [description, setDescription] = useState<string>("");
  const [createBy,setcreateby] = useState<string>("")

  useEffect(() => {
    console.log("project id:", project);
    console.log("id", id);
    console.log("memebers", memberTask);
  }, [memberTask]);

  useEffect(() => {
    const taskDetail = async () => {
      const token = (await SecureStore.getItemAsync("token")) as string;
      try {
        const res = await axios.get(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/projects/${project}/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res) {
          console.log("caccc", res.data.createdBy.email);
          setcreateby(res.data.createdBy.email);              
          setTaskName(res.data.taskName);
          setStartDate(res.data.createdTime);
          setEndDate(res.data.deadline);
          setPrioritySelect(res.data.priority);
          console.log("Task details:", res.data);
          console.log("Task members:", res.data.taskUsers);
          setMemberTask(
            res.data.taskUsers.map(
              (item: { user: { email: string } }) => item.user.email
            )
          );
          setDescription(res.data.description);
          const emails = res.data.taskUsers.map((item: any) => {
            return item.user.email;
          });
          setMemberTask(emails);
        }
        const emails = await axios.get(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/projects/${project}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Project members:", emails.data);
        const email = emails.data.map((item: IProjects_member) => item.email);
        // console.log("Project members:", res.data);
        setProjectMembers(email);
      } catch (error) {
        console.error("Error fetching task data:", error);
        ToastAndroid.show(
          "Error fetching task data, please try again later",
          ToastAndroid.SHORT
        );
      }
    };
    taskDetail();
  }, []);

  const handleSelectMember = (member: string) => {
    if (memberTask.includes(member)) {
      setMemberTask(memberTask.filter((item) => item !== member));
    } else {
      setMemberTask([...memberTask, member]);
    }
    console.log("Selected members:", memberTask);
  };

  const handleSubmit = async () => {
    const token = (await SecureStore.getItemAsync("token")) as string;
    if (
      taskName === "" ||
      description === "" ||
      prioritySelect === "" ||
      memberTask.length === 0 ||
      startDate === "" ||
      endDate === ""
    ) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
    }
    else if(!memberTask.includes(createBy)){
     ToastAndroid.show("you are not allowed to delete createBy from task ", ToastAndroid.SHORT);
      return
    }
    else {
      // Handle task update logic here

      try {
        const member = await axios.put(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/projects/${project}/tasks/${id}/assign`,
          {
            emails: memberTask,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const res = await axios.put(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/projects/${project}/tasks/${id}`,
          {
            description: description,
            deadline: dayjs(endDate).toISOString(),
            state: "Not Done",
            priority: prioritySelect,
            taskName: taskName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

       
        if (member&&res ) {
          ToastAndroid.show("Task updated successfully", ToastAndroid.SHORT);
          router.replace({
            pathname: `/dashboard/project/[project]`,
            params: {
              project: project,
              refresh: "true",
            },
          });
        }
      } catch (error) {
        console.error("Error updating task:", error);
        ToastAndroid.show(
          "Error updating task, please try again later",
          ToastAndroid.SHORT
        );
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
      <View className="flex-row items-center mx-auto h-fit p-3 my-10 w-fit px-5 bg-[#496FCF] rounded-full">
        <Text className="text-white text-xl font-bold ">Edit task</Text>
      </View>
      <ScrollView className="flex-1 bg-[#1D2760] top-0 left-0  rounded-t-[40px] px-6 py-8">
        <View className="flex-col mt-4 gap-3">
          <Text className="text-white ml-2 text-lg mb-2">Task's name</Text>
          <TextInput
            className="bg-[#313384] text-white p-4 rounded-full"
            placeholder="Enter task's name..."
            placeholderTextColor="#9EA4CB"
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>
        <View className="flex-row justify-between mt-8 gap-3">
          <View className="flex-col gap-2 items-start">
            <Text className="text-white bg-[#313384] p-2 px-4 rounded-full text-lg mb-2">
              Start date
            </Text>
            <CalendarPicker date={startDate} onDateChange={setStartDate} />
          </View>
          <View className="flex-col gap-2 items-end">
            <Text className="text-white bg-[#313384] p-2 px-4 rounded-full text-lg mb-2">
              End date
            </Text>
            <CalendarPicker date={endDate} onDateChange={setEndDate} />
          </View>
        </View>
        <View className="flex-col mt-4 w-[50%] pb-10 ">
          <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            className={`rounded-full mt-2 ${
              prioritySelect === "Medium"
                ? "bg-[#4caf50]"
                : prioritySelect === "Important"
                ? "bg-[#ccbb24]"
                : prioritySelect === "Warning"
                ? "bg-[#f44336]"
                : "bg-[#4c4d53]"
            }`}
            style={{
              borderWidth: 2,
              borderColor: "#4c4d53",
            }}
          >
            <Text className="text-white text-lg font-bold text-center">
              {prioritySelect ? `${prioritySelect}` : "Choose Priority"}
            </Text>
          </TouchableOpacity>
          <View>
            {isOpen && (
              <View className="mt-4 p-4  rounded-xl">
                <View className="flex-col gap-3">
                  {priority.map((item, index) => {
                    let priorityColor;
                    if (item === "Medium") priorityColor = "#4caf50"; // Green
                    if (item === "Important") priorityColor = "#ffeb3b"; // Yellow
                    if (item === "Warning") priorityColor = "#f44336"; // Red

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setPrioritySelect(item);
                          setIsOpen(false);
                        }}
                        key={index}
                        className="flex-row items-center justify-start gap-2 px-4 py-3 rounded-xl bg-[#262A6A] hover:bg-[#4c4d53] transition-all duration-300"
                      >
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: priorityColor,
                          }}
                        />
                        <Text className="text-white text-base font-medium">
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="flex-col mt-4 w-full ">
          <Text className="text-white w-[40%] bg-[#313384] p-2 px-4 rounded-full text-lg mb-5">
            Add Members
          </Text>

          <Text
            className={`text-white ${
              memberTask.length > 0 ? "bg-[#787bd5]" : "bg-[#4c4d53]"
            } text-base mb-4 text-center py-2 px-4 rounded-full self-center`}
          >
            {memberTask.length > 0
              ? ` Selected ${memberTask.length} member${
                  memberTask.length > 1 ? "s" : ""
                }`
              : " No members selected"}
          </Text>
          <View style={{ maxHeight: 170, overflow: "hidden" }}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: 16 }}>
                {projectMembers.map((item, index) => {
                  const isSelected = memberTask.includes(item);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectMember(item)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: isSelected ? "#3B41A1" : "#262A6A",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "500",
                          textDecorationLine: isSelected ? "underline" : "none",
                        }}
                      >
                        {item}
                      </Text>
                      {isSelected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#4FD1C5"
                        />
                      ) : (
                        <Entypo name="circle" size={24} color="#8895FF" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
        <View className="flex-col justify-between mt-8 gap-3">
          <Text className="text-white text-center bg-[#313384] w-fit p-2 px-4 rounded-full text-lg mb-2">
            Description
          </Text>
          <TextInput
            className="bg-[#313384] text-white p-4 h-14 px-5 rounded-full"
            placeholder="Enter project description..."
            placeholderTextColor="#9EA4CB"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View className="flex-row justify-between gap-4 mt-2 mb-10 pb-5 mx-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#E26D90] py-3 px-4 rounded-full mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#8D8CC3] py-3 px-4 rounded-full mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditTask;
