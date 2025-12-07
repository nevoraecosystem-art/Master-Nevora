import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  from: 'user' | 'norah';
  text: string;
  createdAt?: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ from, text, createdAt }) => {
  const isUser = from === 'user';
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.norahContainer]}>
      <Text style={styles.sender}>{isUser ? 'Você' : 'Norah'}</Text>
      <Text style={styles.text}>{text}</Text>
      {createdAt && <Text style={styles.time}>{createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: '90%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#1F2235',
    borderWidth: 1,
    borderColor: '#2D3050',
  },
  norahContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#12121C',
    borderWidth: 1,
    borderColor: '#1E1E2C',
  },
  sender: {
    color: '#8B5CF6',
    fontWeight: '700',
    marginBottom: 4,
  },
  text: {
    color: '#E5E7EB',
    fontSize: 15,
  },
  time: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
  },
});

export default MessageBubble;
