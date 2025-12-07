import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../api/authApi';
import { useTasks } from '../store/tasksStore';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [wallet, setWallet] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        setRefreshing(true);
        const response = await authApi.getWallet();
        setWallet(response.data?.balance || response.data?.amount || null);
      } catch (error) {
        setWallet(null);
      } finally {
        setRefreshing(false);
      }
    };

    loadWallet();
  }, []);

  const greeting = user?.name ? `Olá, ${user.name}!` : 'Bem-vindo à Norah Lite!';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Norah Lite" />
        <View style={styles.card}> 
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>Sugestão do dia da Norah:</Text>
          <Text style={styles.tip}>
            Separe 10 minutos para organizar sua lista de afazeres e defina um foco principal.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarefas de hoje</Text>
          {tasks.slice(0, 5).map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <Text style={[styles.taskText, task.done && styles.taskDone]}>{task.title}</Text>
              <Text style={styles.taskStatus}>{task.done ? 'Feita' : 'Pendente'}</Text>
            </View>
          ))}
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma tarefa adicionada ainda.</Text>
          ) : null}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Tasks' as never)}
          >
            <Text style={styles.secondaryText}>Ver todas as tarefas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}> 
          <Text style={styles.sectionTitle}>Converse com a Norah</Text>
          <Text style={styles.sectionDescription}>
            Tire dúvidas rápidas, peça ideias e organize seus próximos passos com a Norah Lite.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Chat' as never)}>
            <Text style={styles.primaryText}>Falar com a Norah</Text>
          </TouchableOpacity>
        </View>

        {wallet !== null ? (
          <View style={styles.section}> 
            <Text style={styles.sectionTitle}>Seu saldo NEV</Text>
            <Text style={styles.wallet}>{wallet} NEV</Text>
            <Text style={styles.sectionDescription}>Saldo vindo do backend /api/users/me/wallet.</Text>
          </View>
        ) : null}

        {refreshing ? <Text style={styles.hint}>Atualizando dados...</Text> : null}
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
    backgroundColor: '#1b4b66',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  greeting: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 10,
    color: '#dce8f1',
    fontWeight: '600',
  },
  tip: {
    marginTop: 6,
    color: '#f2f7fb',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102542',
    marginBottom: 10,
  },
  sectionDescription: {
    color: '#4a5c6b',
    lineHeight: 20,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },
  taskText: {
    color: '#102542',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#6c7c8d',
  },
  taskStatus: {
    color: '#1b4b66',
    fontWeight: '600',
  },
  emptyText: {
    color: '#6c7c8d',
    marginBottom: 10,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#e8f1f5',
  },
  secondaryText: {
    color: '#1b4b66',
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1b4b66',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  wallet: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b4b66',
    marginBottom: 6,
  },
  hint: {
    textAlign: 'center',
    color: '#6c7c8d',
    marginBottom: 20,
  },
});

export default HomeScreen;
// implementado na Etapa 2
