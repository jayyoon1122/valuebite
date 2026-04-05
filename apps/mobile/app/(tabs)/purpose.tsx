import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const PURPOSES = [
  { key: 'daily_eats', icon: '🍱', label: 'Daily Eats', desc: 'Everyday meals', price: 'Under ¥1,000' },
  { key: 'good_value', icon: '💰', label: 'Good Value', desc: 'Best bang for buck', price: 'Under ¥1,500' },
  { key: 'date_night', icon: '🥂', label: 'Date Night', desc: 'Romantic + affordable', price: 'Under ¥2,500' },
  { key: 'family_dinner', icon: '👨‍👩‍👧‍👦', label: 'Family Dinner', desc: 'Kid-friendly, generous', price: 'Under ¥2,000' },
  { key: 'late_night', icon: '🌙', label: 'Late Night', desc: 'Open after 10pm', price: 'Under ¥1,200' },
  { key: 'healthy_budget', icon: '🥗', label: 'Healthy & Budget', desc: 'Nutritious + cheap', price: 'Under ¥1,400' },
  { key: 'solo_dining', icon: '🧑‍💻', label: 'Solo Dining', desc: 'Counter seats, no minimums', price: 'Under ¥1,200' },
  { key: 'group_party', icon: '🎉', label: 'Group & Party', desc: 'Sharing menus, big tables', price: 'Under ¥1,500/person' },
  { key: 'special', icon: '🎂', label: 'Special Occasion', desc: 'Celebrate on a budget', price: 'Under ¥5,000' },
];

export default function PurposeTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse by Purpose</Text>
        <Text style={styles.subtitle}>Find restaurants that fit your needs</Text>
      </View>

      <FlatList
        data={PURPOSES}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 14, padding: 16, marginBottom: 10, gap: 14 },
  icon: { fontSize: 32 },
  label: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  price: { fontSize: 12, color: '#22c55e', fontWeight: '500', marginTop: 2 },
  arrow: { fontSize: 24, color: '#d1d5db' },
});
