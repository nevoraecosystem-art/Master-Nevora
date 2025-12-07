import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../store/tasksStore';
import Loader from '../components/Loader';

const TasksScreen = () => {
  const { tasks, addTask, toggleTask, removeTask, loading } = useTasks();
  const [newTask, setNewTask] = useState('');

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask.trim());
    setNewTask('');
  };

  if (loading) {
    return <Loader message="Carregando suas tarefas" />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Tarefas" />
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Adicionar nova tarefa"
            style={styles.input}
            value={newTask}
            onChangeText={setNewTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.caption}>As tarefas são salvas localmente e futuramente serão sincronizadas.</Text>

        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onRemove={() => removeTask(task.id)}
          />
        ))}

        {tasks.length === 0 ? <Text style={styles.empty}>Nenhuma tarefa adicionada.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d4dce4',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  addButton: {
    backgroundColor: '#1b4b66',
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  caption: {
    color: '#6c7c8d',
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#6c7c8d',
    marginTop: 20,
  },
});

export default TasksScreen;
// implementado na Etapa 2
