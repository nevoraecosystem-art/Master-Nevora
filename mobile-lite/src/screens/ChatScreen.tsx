import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import Loader from '../components/Loader';
import { norahApi } from '../api/norahApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'norah';
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Olá! Eu sou a Norah Lite. Como posso ajudar na sua rotina hoje? 😊',
      sender: 'norah',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMessage: Message = { id: Date.now().toString(), text: input.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);
    try {
      const response = await norahApi.sendMessage(userMessage.text);
      const reply = (response.data?.reply as string) || 'Estou aqui para ajudar!';
      const norahMessage: Message = {
        id: `${Date.now()}-reply`,
        text: reply,
        sender: 'norah',
      };
      setMessages((prev) => [...prev, norahMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          text: 'Não consegui responder agora. Tente novamente em instantes.',
          sender: 'norah',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!messages.length) {
    return <Loader message="Carregando conversa..." />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.container}>
          <Header title="Norah" />
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble text={item.text} sender={item.sender} />
            )}
            contentContainerStyle={styles.list}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={sending}>
              <Text style={styles.sendText}>{sending ? '...' : 'Enviar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    padding: 16,
  },
  list: {
    paddingVertical: 12,
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d4dce4',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1b4b66',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ChatScreen;
// implementado na Etapa 2
