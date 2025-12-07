import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/store/authStore';
import { TasksProvider } from './src/store/tasksStore';

export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </TasksProvider>
    </AuthProvider>
  );
}
