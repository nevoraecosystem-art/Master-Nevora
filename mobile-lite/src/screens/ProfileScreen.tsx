import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../store/authStore';
import { authApi } from '../api/authApi';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [wallet, setWallet] = useState<number | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await authApi.getWallet();
        setWallet(response.data?.balance || response.data?.amount || null);
      } catch (error) {
        setWallet(null);
      }
    };
    fetchWallet();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Perfil" />
        <View style={styles.card}>
          <Text style={styles.title}>{user?.name || 'Usuário Norah Lite'}</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
          <Text style={styles.tag}>Papel: {user?.role}</Text>
          {wallet !== null ? <Text style={styles.tag}>Saldo: {wallet} NEV</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências locais</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Notificações</Text>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Tema escuro</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
          <Text style={styles.hint}>Estas preferências são locais e podem ser integradas ao backend futuramente.</Text>
        </View>

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#102542',
  },
  subtitle: {
    color: '#4a5c6b',
    marginVertical: 4,
  },
  tag: {
    color: '#1b4b66',
    fontWeight: '700',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102542',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    color: '#102542',
    fontWeight: '600',
  },
  hint: {
    color: '#6c7c8d',
    marginTop: 8,
  },
  logout: {
    backgroundColor: '#cc4b4b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ProfileScreen;
// implementado na Etapa 2
