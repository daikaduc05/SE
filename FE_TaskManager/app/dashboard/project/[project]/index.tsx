import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  ToastAndroid,
  Modal,
} from "react-native";
import BackButton from "@/common/BackButton";
import CalendarPicker from "@/common/CalenderHeader";
import { ITaskFull } from "@/model/ITask";
import dayjs from "dayjs";
import TaskItem from "@/common/TaskItem";
import { IProjects_Detail } from "@/model/IProjects";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Component chính cho trang chi tiết dự án
const ProjectDetail = () => {
  // Cập nhật enum EFilter với 3 trạng thái
  const enum EFilter {
    Done = "Done",
    NotDone = "Not Done",
    All = "All",
  }

  const enum EType {
    Today = "today",
    All = "all",
  }
  const { project } = useLocalSearchParams() as { project: string };
  const [filter, setFilter] = useState<EFilter>(EFilter.All);
  const [type, setType] = useState<EType>(EType.All);
  const animatedLine = useRef(new Animated.Value(0)).current;
  const [date, setDate] = useState<string>();
  const [tasks, setTasks] = useState<ITaskFull[]>([]);
  const [projectInfo, setProjectInfo] = useState<IProjects_Detail>(); // Thay thế any bằng kiểu dữ liệu thực tế của project
  const [originalTasks, setOriginalTasks] = useState<ITaskFull[]>([]); // Lưu trữ danh sách công việc gốc
  const [isvisible, setIsVisible] = useState(false); // Trạng thái hiển thị modal
  const [taskId, setTaskId] = useState<string | null>(null); // ID công việc được chọn
  const { refresh } = useLocalSearchParams();

  const handleDelete = async (id: string) => {
    try {
      console.log(
        "del api",
        `${process.env.EXPO_PUBLIC_API_URL}/projects/${project}/tasks/${id}`
      );
      const res = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/projects/${project}/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.status === 204) {
        ToastAndroid.show("Delete success", ToastAndroid.SHORT);
        setOriginalTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      ToastAndroid.show("Try again!", ToastAndroid.SHORT);
      console.log("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const fetching = async () => {
      try {
        const getProject = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${project}`,
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync(
                "token"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProjectInfo(getProject.data);
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/projects/${project}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync(
                "token"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOriginalTasks(response.data);
      } catch (error) {
        console.log("Error fetching project data:", error);
      }
    };
    fetching();
  }, [refresh]);
  // Cập nhật trạng thái công việc khi người dùng nhấn vào

  const toggleTaskStatus = async (taskId: string) => {
    setOriginalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              state:
                task.state === EFilter.Done ? EFilter.NotDone : EFilter.Done,
            }
          : task
      )
    );
    try {
      const task = originalTasks.find((t) => t.id === taskId);
      const newState =
        task?.state === EFilter.Done ? EFilter.NotDone : EFilter.Done;

      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/projects/${project}/tasks/${taskId}`,
        {
          state: newState,
        },
        {
          headers: {
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      // Nếu lỗi, revert lại thay đổi
      ToastAndroid.show(
        "Cập nhật thất bại, vui lòng thử lại.",
        ToastAndroid.SHORT
      );
      setOriginalTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                state:
                  task.state === EFilter.Done ? EFilter.NotDone : EFilter.Done,
              }
            : task
        )
      );
      console.log("Error updating task status:", error);
    }
  };

  useEffect(() => {
    let filtered = originalTasks;

    if (filter !== EFilter.All) {
      filtered = filtered.filter((t) => t.state === filter);
    }

    if (date) {
      const d = new Date(date).setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        const start = new Date(t.createdTime).setHours(0, 0, 0, 0);
        const end = new Date(t.deadline).setHours(0, 0, 0, 0);
        return d >= start && d <= end;
      });
    }

    setTasks(filtered);
  }, [filter, date, originalTasks]);

  const handleToday = () => {
    setType(EType.Today);
    setDate(dayjs().format("YYYY-MM-DD"));
  };
  const handleAll = () => {
    setType(EType.All);
    setDate(undefined);
  };

  // Animation cho line chuyển động giữa "today" và "all"
  useEffect(() => {
    Animated.timing(animatedLine, {
      toValue: type === "today" ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [type]);

  // Tính toán % công việc hoàn thành
  const completedPercentage = Math.round(
    (tasks.filter((t) => t.state === EFilter.Done).length / tasks.length) * 100
  );

  return (
    <View className="flex-1 bg-[#1D2760] ">
      {/* Gradient background */}
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />

      {/* Header */}
      <BackButton />
      <View className="flex-row justify-between items-center p-6 mt-14">
        <View className="flex-row items-center gap-3">
          <Text className="text-white text-xl font-bold">
            {projectInfo?.name}
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/dashboard/project/edit/${project}`)}
          >
            <AntDesign name="edit" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/dashboard/project/detail/${project}`)}
          >
            <AntDesign name="eyeo" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push(`/dashboard/project/${project}/task/create`)
          }
          className="bg-[#4143c6] p-4 rounded-full"
        >
          <Text className="text-white text-lg font-medium">Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 bg-[#1D2760]/80 rounded-t-[40px] mt-2 p-6 px-8">
        {/* Project stats */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-col gap-2 items-start">
            <Text className="text-white text-lg mb-2 font-semibold">
              Today's Monday
            </Text>
            <Text className="text-gray-300">
              Create at :
              {projectInfo?.startDate
                ? dayjs(projectInfo.startDate).format("DD/MM/YYYY")
                : ""}
            </Text>
          </View>
          <View className="flex-col  items-end gap-6">
            <Text className="text-white text-lg font-semibold">
              {completedPercentage
                ? completedPercentage + "% Done"
                : tasks.length === 0
                ? "No tasks"
                : "0% Done"}
            </Text>
            <Animated.View
              className={`w-[100px] h-[6px] flex-col items-end rounded-full border-[0.5px] border-white`}
            >
              <Animated.View
                style={{
                  width: completedPercentage && `${completedPercentage}%`,
                }}
                className={`h-full rounded-full bg-white`}
              ></Animated.View>
            </Animated.View>
          </View>
        </View>

        {/* Task today and all tasks */}
        <View className="flex-col justify-between items-center mb-4">
          <View className="flex-row w-full justify-between items-center gap-2">
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-[#313384]/50 px-4 py-2 rounded-xl"
              onPress={() => handleToday()}
            >
              <Text className="text-white font-medium">
                {
                  tasks.filter(
                    (t) => new Date(t.createdTime).toLocaleDateString() === date
                  ).length
                }
              </Text>
              <Text className="text-gray-300">Tasks today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-[#313384]/50 px-4 py-2 rounded-xl"
              onPress={() => handleAll()}
            >
              <Text className="text-white font-medium">{tasks.length}</Text>
              <Text className="text-gray-300">All day</Text>
            </TouchableOpacity>
          </View>

          {/* Line */}
          <Animated.View className="w-full h-[2px] mt-2 bg-white/20">
            {type === "today" ? (
              <Animated.View
                className="w-1/3 h-[3px] bg-white"
                style={{
                  transform: [
                    {
                      translateX: animatedLine.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100],
                      }),
                    },
                  ],
                }}
              />
            ) : (
              <Animated.View
                className="w-1/3 h-[3px] bg-white"
                style={{
                  transform: [
                    {
                      translateX: animatedLine.interpolate({
                        inputRange: [0, 1],
                        outputRange: [150, 250],
                      }),
                    },
                  ],
                }}
              />
            )}
          </Animated.View>
        </View>

        {/* Filter buttons */}
        <View className="flex-row gap-4 mb-6 justify-end">
          {[EFilter.Done, EFilter.NotDone, EFilter.All].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2  rounded-full ${
                filter === f
                  ? f === EFilter.Done
                    ? "bg-green-500"
                    : f === EFilter.NotDone
                    ? "bg-red-500"
                    : "bg-blue-500"
                  : "bg-transparent"
              }`}
            >
              <Text className="text-white">{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar */}
        <View>
          <CalendarPicker
            date={date || dayjs().format("YYYY-MM-DD")}
            onDateChange={(date) => {
              setDate(date);
            }}
          />
        </View>

        {/* Tasks list */}
        <ScrollView className="flex-1">
          {tasks.map((task: ITaskFull) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTaskStatus(task.id)}
              setIsVisible={setIsVisible}
              setTaskId={setTaskId}
              projectId={project}
            />
          ))}
        </ScrollView>
      </View>
      {isvisible && (
        <Modal
          transparent
          animationType="fade"
          visible={isvisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-[80%] p-6 rounded-xl">
              <Text className="text-center text-lg font-semibold mb-4">
                Are you sure you want to delete this task?
              </Text>
              <View className="flex-row justify-around mt-4">
                <TouchableOpacity
                  className="bg-red-500 px-6 py-2 rounded-md"
                  onPress={() => {
                    if (taskId) {
                      handleDelete(taskId);
                    }
                    setIsVisible(false);
                  }}
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-300 px-6 py-2 rounded-md"
                  onPress={() => setIsVisible(false)}
                >
                  <Text className="text-black font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ProjectDetail;
