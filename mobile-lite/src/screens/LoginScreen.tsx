import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../store/authStore';
import Loader from '../components/Loader';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      if (!email || !password || (mode === 'register' && !name)) {
        setError('Preencha todos os campos.');
        return;
      }
      if (mode === 'register') {
        await register({ name, email, password, role: 'CLIENT' });
      } else {
        await login({ email, password });
      }
      navigation.navigate('Home' as never);
    } catch (err) {
      setError('Não foi possível autenticar. Verifique os dados.');
    }
  };

  if (loading) {
    return <Loader message="Entrando..." />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Header title={mode === 'login' ? 'Entrar' : 'Criar conta'} />

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, mode === 'login' && styles.toggleActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, mode === 'register' && styles.toggleActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.toggleText, mode === 'register' && styles.toggleTextActive]}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'register' ? (
            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                placeholder="Seu nome"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              placeholder="voce@email.com"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="••••••••"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryText}>{mode === 'login' ? 'Entrar' : 'Registrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Onboarding' as never)}>
            <Text style={styles.link}>Voltar para apresentação</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    padding: 24,
    flexGrow: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#e8f1f5',
    borderRadius: 14,
    padding: 4,
    marginVertical: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleText: {
    color: '#6c7c8d',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#1b4b66',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: '#102542',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d4dce4',
  },
  error: {
    color: '#cc4b4b',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1b4b66',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#1b4b66',
    fontWeight: '600',
  },
});

export default LoginScreen;
// implementado na Etapa 2
