import { fProject } from "@/fakedb";
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
  Image,
} from "react-native";
import BackButton from "@/common/BackButton";
import CalendarPicker from "@/common/CalenderHeader";
import { ITask } from "@/model/ITask";
import dayjs from "dayjs";
import TaskItem from "@/common/TaskItem";

const tasksList = [
  {
    id: "1",
    project_id: "project-1",
    description: "Đi dắt chó đi dạo buổi sáng",
    state: "Done",
    priority: "Medium",
    task_name: "Walk my dog",
    created_time: "2025-04-08",
    deadline: "2025-04-08",
    done_at: "2025-04-08",
    created_by: "user-1",
  },
  {
    id: "2",
    project_id: "project-1",
    description: "Đi dắt chó đi dạo buổi chiều",
    state: "Not Done", // Thay đổi trạng thái thành Not Done
    priority: "High",
    task_name: "Walk my dog",
    created_time: "2025-04-08",
    deadline: "2025-04-08",
    done_at: "",
    created_by: "user-2",
  },
  {
    id: "3",
    project_id: "project-1",
    description: "Đi dắt chó đi dạo buổi tối",
    state: "Not Done", // Thay đổi trạng thái thành Not Done
    priority: "Low",
    task_name: "Walk my dog",
    created_time: "2025-04-08",
    deadline: "2025-04-08",
    done_at: "",
    created_by: "user-3",
  },
];

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
  const { id } = useLocalSearchParams();
  const project = fProject.find((p) => p.id === id);
  const [filter, setFilter] = useState<EFilter>(EFilter.All);
  const [type, setType] = useState<EType>(EType.Today);
  const animatedLine = useRef(new Animated.Value(0)).current;
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [tasks, setTasks] = useState<ITask[]>(
    tasksList.filter((t) => t.created_time === date)
  );
  const toggleTaskStatus = (taskId:String) => {
    setTasks((prevTasks: ITask[]) =>
      prevTasks.map((task: ITask) =>
        task.id === taskId
          ? {
              ...task,
              state:
                task.state === EFilter.Done ? EFilter.NotDone : EFilter.Done,
            }
          : task
      )
    );
  };

  useEffect(() => {
    let filteredTasks = tasksList;
    if (filter === EFilter.Done) {
      filteredTasks = filteredTasks.filter((t) => t.state === EFilter.Done);
    } else if (filter === EFilter.NotDone) {
      filteredTasks = filteredTasks.filter((t) => t.state === EFilter.NotDone);
    }
    if (type !== EType.All) {
      filteredTasks = filteredTasks.filter((t) => t.created_time === date);
    }
    setTasks(filteredTasks);
  }, [date, filter]);

  useEffect(() => {
    Animated.timing(animatedLine, {
      toValue: type === "today" ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [type]);

  const handleSetToday = () => {
    setType(EType.Today);
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    setDate(todayString);
    setTasks(tasks.filter((t) => t.created_time === todayString));
  };
  const handleSetAll = () => {
    setType(EType.All);
    setTasks(tasksList);
    console.log(date);
  };

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
          <Text className="text-white text-xl font-bold">{project?.name}</Text>
          <TouchableOpacity onPress={() => router.push(`/dashboard/project/edit/${id}`)}>
            <AntDesign name="edit" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/dashboard/project/detail/${id}`)}>
            <AntDesign name="eyeo" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/dashboard/project/task/create")}
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
              Create at :{project?.created_at}
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
              onPress={() => handleSetToday()}
            >
              <Text className="text-white font-medium">
                {tasksList.filter((t) => t.created_time === date).length}
              </Text>
              <Text className="text-gray-300">Tasks today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-[#313384]/50 px-4 py-2 rounded-xl"
              onPress={() => handleSetAll()}
            >
              <Text className="text-white font-medium">{tasksList.length}</Text>
              <Text className="text-gray-300">All tasks</Text>
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
            date={date}
            onDateChange={(date) => {
              setDate(date);
            }}
          />
        </View>

        {/* Tasks list */}
        <ScrollView className="flex-1">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={()=>toggleTaskStatus(task.id)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ProjectDetail;
