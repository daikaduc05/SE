import { ITaskFull } from "@/model/ITask";
import React, { useRef } from "react";
import {
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

interface TaskItemProps {
  task: ITaskFull;
  onToggle: (id: string) => void;
  setIsVisible: (visible: boolean) => void;
  setTaskId: (id: string) => void;
  projectId: string;
}

const TaskItem = ({
  task,
  onToggle,
  setIsVisible,
  setTaskId,
  projectId,
}: TaskItemProps) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          onToggle(task.id);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "medium":
        return "#22c55e";
      case "important":
        return "#facc15";
      case "warning":
        return "#ef4444";
      default:
        return "#d1d5db";
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Vùng chứa toàn bộ task + action */}
      <View style={styles.rowContainer}>
        {/* VÙNG SWIPE (bên trái) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.swipeableContainer,
            {
              transform: [{ translateX: pan.x }],
            },
          ]}
        >
          <Text style={styles.taskName}>{task.taskName}</Text>

          <View
            style={[
              styles.stateContainer,
              task.state === "Done" ? styles.doneState : styles.notDoneState,
            ]}
          >
            <Text
              style={
                task.state === "Done"
                  ? styles.doneText
                  : styles.notDoneText
              }
            >
              {task.state}
            </Text>
            {task.state === "Done" && task.doneAt && (
              <Text style={styles.doneAt}>
                {new Date(task.doneAt).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View style={styles.priorityWrapper}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            />
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </Animated.View>

        {/* VÙNG NÚT CỐ ĐỊNH (bên phải) */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#3B82F6" }]}
            onPress={() =>
              router.push({
                pathname: "/dashboard/project/[project]/task/[id]",
                params: { project: projectId, id: task.id },
              })
            }
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#DC2626" }]}
            onPress={() => {
              setTaskId(task.id);
              setIsVisible(true);
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>

        
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  swipeableContainer: {
    flex: 1,
    padding: 16,
  },
  taskName: {
    color: "#1D2760",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  stateContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 8,
    gap: 8,
  },
  doneAt: {
    color: "#9CA3AF",
    fontSize: 12,
    marginLeft: 6,
  },
  doneState: {
    backgroundColor: "#dcfce7",
  },
  notDoneState: {
    backgroundColor: "#fee2e2",
  },
  doneText: {
    color: "#16a34a",
    fontWeight: "600",
  },
  notDoneText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  priorityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 9999,
  },
  priorityText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actions: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6", // ✅ Gợi ý: gray-100
  },
  
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default TaskItem;
