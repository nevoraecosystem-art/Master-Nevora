import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#11111A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E1E2C',
    marginBottom: 12,
  },
  title: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    color: '#F9FAFB',
    fontSize: 22,
    fontWeight: '800',
  },
  description: {
    color: '#6B7280',
    marginTop: 6,
  },
});

export default MetricCard;
