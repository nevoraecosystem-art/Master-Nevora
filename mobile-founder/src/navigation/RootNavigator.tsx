import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import useAuthStore from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0B0B0F',
    text: '#FFFFFF',
    card: '#11111A',
  },
};

const RootNavigator = () => {
  const { user, restoreSession, loading } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0B0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#7C3AED" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
