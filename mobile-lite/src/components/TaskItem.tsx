import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TaskItemData } from '../store/tasksStore';

interface Props {
  task: TaskItemData;
  onToggle: () => void;
  onRemove: () => void;
}

const TaskItem: React.FC<Props> = ({ task, onToggle, onRemove }) => {
  return (
    <View style={[styles.container, task.done && styles.completed]}>
      <Pressable onPress={onToggle} style={styles.checkboxWrapper}>
        <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
          {task.done ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
      </Pressable>
      <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <Text style={styles.remove}>✕</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  completed: {
    backgroundColor: '#f4f7fb',
  },
  checkboxWrapper: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#9bb1c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#1b4b66',
    borderColor: '#1b4b66',
  },
  checkmark: {
    color: '#fff',
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#102542',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#6c7c8d',
  },
  remove: {
    color: '#cc4b4b',
    fontSize: 16,
    paddingHorizontal: 6,
  },
});

export default TaskItem;
