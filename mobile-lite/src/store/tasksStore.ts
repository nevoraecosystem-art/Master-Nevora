import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface TaskItemData {
  id: string;
  title: string;
  done: boolean;
}

interface TasksContextValue {
  tasks: TaskItemData[];
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  loading: boolean;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);
const STORAGE_KEY = 'norah-lite-tasks';

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const persist = useCallback(async (data: TaskItemData[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(
    async (title: string) => {
      const newTask: TaskItemData = {
        id: `${Date.now()}-${Math.random()}`,
        title,
        done: false,
      };
      setTasks((prev) => {
        const updated = [...prev, newTask];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      setTasks((prev) => {
        const updated = prev.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const removeTask = useCallback(
    async (id: string) => {
      setTasks((prev) => {
        const updated = prev.filter((task) => task.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, removeTask, loading }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return ctx;
};
