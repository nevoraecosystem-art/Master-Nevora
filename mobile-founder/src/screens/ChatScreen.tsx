import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import { sendNorahMessage } from '../api/norahApi';

interface Message {
  id: string;
  from: 'user' | 'norah';
  text: string;
  createdAt: Date;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'norah',
      text: 'Olá, Founder. Pronta para executar suas solicitações.',
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: input.trim(),
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);
    try {
      const response = await sendNorahMessage(userMessage.text);
      const norahMessage: Message = {
        id: `norah-${Date.now()}`,
        from: 'norah',
        text: response.reply,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, norahMessage]);
    } catch (error) {
      const norahMessage: Message = {
        id: `norah-error-${Date.now()}`,
        from: 'norah',
        text: 'Não foi possível enviar sua mensagem agora. Tente novamente.',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, norahMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header showBack />
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>Founder Mode conectado</Text>
        <Text style={styles.badgeAlt}>Canal: Lite</Text>
      </View>
      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble from={item.from} text={item.text} createdAt={item.createdAt} />}
        contentContainerStyle={styles.listContent}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite sua mensagem para a Norah"
            placeholderTextColor="#6B7280"
            style={styles.input}
            value={input}
            onChangeText={setInput}
            editable={!sending}
          />
          <TouchableOpacity style={[styles.sendButton, sending && styles.sendDisabled]} onPress={handleSend} disabled={sending}>
            <Text style={styles.sendText}>{sending ? 'Enviando...' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  badgeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  badge: {
    backgroundColor: '#1F2235',
    color: '#8B5CF6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    fontWeight: '700',
  },
  badgeAlt: {
    backgroundColor: '#11111A',
    color: '#9CA3AF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0F0F17',
    borderTopWidth: 1,
    borderTopColor: '#1F1F2A',
  },
  input: {
    flex: 1,
    backgroundColor: '#11111A',
    color: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F1F2A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sendDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: '#0B0B0F',
    fontWeight: '800',
  },
});

export default ChatScreen;
