import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import Loader from '../components/Loader';
import useFounderStore from '../store/founderStore';
import { sendFounderCommand } from '../api/founderApi';

const DashboardScreen: React.FC = () => {
  const { norahStatus, eventsCount, walletBalance, loading, error, loadDashboard } = useFounderStore();
  const [command, setCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleExecute = async () => {
    if (!command.trim()) return;
    setExecuting(true);
    try {
      const response = await sendFounderCommand(command.trim());
      setCommandOutput(response.result || 'Executado com sucesso');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao executar comando';
      setCommandOutput(message);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>Visão geral</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <MetricCard
          title="Status da Norah"
          value={norahStatus?.status || 'Desconhecido'}
          description={norahStatus?.uptime ? `Uptime: ${norahStatus.uptime}` : 'Monitorando o core da IA'}
        />
        <MetricCard title="Eventos registrados" value={eventsCount} description="Total capturado no ecossistema" />
        <MetricCard title="Wallet NEV" value={walletBalance} description="Saldo disponível" />

        {norahStatus?.orchestratorStartedAt && (
          <MetricCard
            title="Orchestrator"
            value={new Date(norahStatus.orchestratorStartedAt).toLocaleString()}
            description={`Módulos ativos: ${norahStatus.modules?.length || 0}`}
          />
        )}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Console Founder</Text>
        <View style={styles.commandBox}>
          <TextInput
            style={styles.commandInput}
            placeholder="Comando para Norah (Founder Mode)"
            placeholderTextColor="#6B7280"
            value={command}
            onChangeText={setCommand}
            multiline
          />
          <TouchableOpacity style={[styles.executeButton, executing && styles.executeDisabled]} onPress={handleExecute} disabled={executing}>
            <Text style={styles.executeText}>{executing ? 'Executando...' : 'Executar'}</Text>
          </TouchableOpacity>
          {commandOutput && (
            <View style={styles.outputBox}>
              <Text style={styles.outputTitle}>Resposta</Text>
              <Text style={styles.outputText}>{commandOutput}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    color: '#E5E7EB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  error: {
    color: '#F87171',
    marginBottom: 12,
  },
  commandBox: {
    backgroundColor: '#0F0F17',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F1F2A',
  },
  commandInput: {
    backgroundColor: '#11111A',
    color: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F1F2A',
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  executeButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  executeDisabled: {
    opacity: 0.7,
  },
  executeText: {
    color: '#0B0B0F',
    fontWeight: '800',
  },
  outputBox: {
    backgroundColor: '#11111A',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1F1F2A',
  },
  outputTitle: {
    color: '#9CA3AF',
    marginBottom: 6,
  },
  outputText: {
    color: '#F3F4F6',
  },
});

export default DashboardScreen;
// implementado na Etapa 2
