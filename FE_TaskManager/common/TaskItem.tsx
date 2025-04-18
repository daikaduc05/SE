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

const TaskItem = ({
  task,
  onToggle,
  setIsVisible,
  setTaskId,
  onEdit,
}: {
  task: ITaskFull;
  onToggle: (id: string) => void;
  setIsVisible: (visible: boolean) => void;
  setTaskId: (id: string) => void;
  onEdit: (id: string) => void;
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
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
        return "#22c55e"; // green
      case "important":
        return "#facc15"; // yellow
      case "warning":
        return "#ef4444"; // red
      default:
        return "#d1d5db"; // gray fallback
    }
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }],
        },
      ]}
    >
      <View style={styles.contentWrapper}>
        <View style={{ flex: 1 }}>
          <Text style={styles.taskName}>{task.taskName}</Text>

          <View
            style={[
              styles.stateContainer,
              task.state === "Done" ? styles.doneState : styles.notDoneState,
            ]}
          >
            <Text
              style={
                task.state === "Done" ? styles.doneText : styles.notDoneText
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
        </View>

        <View className="w-[50px] flex-col justify-evenly gap-6" style={styles.actions}>
          <TouchableOpacity 
          className="w-full"
            style={[styles.actionBtn, { backgroundColor: "#3B82F6" }]}
            onPress={() => onEdit(task.id)}
          >
            <Text className="text-center" style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
          className="w-full"
            style={[styles.actionBtn, { backgroundColor: "#DC2626" }]}
            onPress={() => {
              setIsVisible(true);
              setTaskId(task.id);
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 8,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 8,
    marginLeft: 12,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TaskItem;
