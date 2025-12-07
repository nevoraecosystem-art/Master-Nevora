import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import useAuthStore from '../store/authStore';
import Loader from '../components/Loader';

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Credenciais inválidas';
      Alert.alert('Erro', message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Norah Founder</Text>
      <Text style={styles.subtitle}>Acesso exclusivo para Founders</Text>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          placeholder="seu@email.com"
          placeholderTextColor="#6B7280"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#6B7280"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#0F0F17',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F2A',
  },
  label: {
    color: '#9CA3AF',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#11111A',
    borderColor: '#1F1F2A',
    borderWidth: 1,
    borderRadius: 10,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B0B0F',
    fontWeight: '800',
    fontSize: 16,
  },
  error: {
    color: '#F87171',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
