import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'norah';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  const isUser = sender === 'user';
  return (
    <View style={[styles.container, isUser ? styles.user : styles.norah]}>
      <Text style={[styles.text, isUser ? styles.userText : styles.norahText]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
  },
  user: {
    backgroundColor: '#1b4b66',
    alignSelf: 'flex-end',
  },
  norah: {
    backgroundColor: '#e8f1f5',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  norahText: {
    color: '#102542',
  },
});

export default MessageBubble;
