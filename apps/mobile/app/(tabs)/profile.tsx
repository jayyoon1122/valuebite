import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ProfileTab() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>TokyoFoodie</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.3 Expert 🎯 · 1,250 pts</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[{ n: '27', l: 'Reviews' }, { n: '12', l: 'Photos' }, { n: '45', l: 'Helpful' }, { n: '8', l: 'Favs' }].map((s) => (
            <View key={s.l} style={styles.stat}>
              <Text style={styles.statNum}>{s.n}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Budget summary */}
        <View style={styles.budgetCard}>
          <Text style={styles.budgetTitle}>💳 Monthly Budget</Text>
          <View style={styles.budgetRow}>
            <View>
              <Text style={styles.budgetAmount}>¥3,120</Text>
              <Text style={styles.budgetLabel}>Spent</Text>
            </View>
            <View>
              <Text style={styles.budgetAmount}>¥26,880</Text>
              <Text style={styles.budgetLabel}>Remaining</Text>
            </View>
            <View>
              <Text style={[styles.budgetAmount, { color: '#22c55e' }]}>On Track</Text>
              <Text style={styles.budgetLabel}>Status</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '10%' }]} />
          </View>
        </View>

        {/* Menu items */}
        {[
          { icon: '❤️', label: 'Favorites', count: '8' },
          { icon: '⭐', label: 'My Reviews', count: '27' },
          { icon: '📸', label: 'My Photos', count: '12' },
          { icon: '🏆', label: 'Badges & Points', count: '2 earned' },
          { icon: '🔔', label: 'Price Alerts', count: '2 new' },
          { icon: '⚙️', label: 'Settings', count: '' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuCount}>{item.count}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 16, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', paddingTop: 12, marginBottom: 16 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 28 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  levelBadge: { marginTop: 4 },
  levelText: { fontSize: 12, color: '#22c55e', fontWeight: '500' },
  statsRow: { flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 14, padding: 14, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  budgetCard: { backgroundColor: '#f9fafb', borderRadius: 14, padding: 16, marginBottom: 16 },
  budgetTitle: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  budgetAmount: { fontSize: 16, fontWeight: '700' },
  budgetLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  progressBar: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', gap: 12 },
  menuIcon: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 15 },
  menuCount: { fontSize: 13, color: '#9ca3af' },
  menuArrow: { fontSize: 20, color: '#d1d5db' },
});
