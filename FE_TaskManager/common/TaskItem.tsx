import React, { useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet } from 'react-native';

const TaskItem = ({ task, onToggle }: { task: any, onToggle: any }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
     
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x },
        ],
        { useNativeDriver: false }
      ),
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

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }]
        }
      ]}
    >
      <View style={styles.contentWrapper}>
        <Text style={styles.taskName}>
          {task.task_name}
        </Text>
        <View
          style={[
            styles.stateContainer,
            task.state === "Done" ? styles.doneState : styles.notDoneState
          ]}
        >
          <Text
            style={[
              task.state === "Done" ? styles.doneText : styles.notDoneText
            ]}
          >
            {task.state}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskName: {
    color: '#1D2760',
    fontWeight: '500'
  },
  stateContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999
  },
  doneState: {
    backgroundColor: '#dcfce7'
  },
  notDoneState: {
    backgroundColor: '#fee2e2'
  },
  doneText: {
    color: '#16a34a'
  },
  notDoneText: {
    color: '#dc2626'
  }
});

export default TaskItem;