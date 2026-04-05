import { View, Text, StyleSheet } from 'react-native';

export default function PurposeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse by Purpose</Text>
      <Text style={styles.subtitle}>Daily Eats, Date Night, Solo Dining...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 8 },
});
