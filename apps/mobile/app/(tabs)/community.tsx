import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const POSTS = [
  { id: '1', type: 'Tip', user: 'TokyoFoodie', title: 'Best lunch sets under ¥500 in Shinjuku', upvotes: 42, comments: 12, time: '2h ago', color: '#3b82f6' },
  { id: '2', type: 'Deal', user: 'BudgetEater', title: 'Matsuya added new ¥390 breakfast set!', upvotes: 89, comments: 23, time: '5h ago', color: '#22c55e' },
  { id: '3', type: 'Discussion', user: 'RamenHunter', title: 'Is Ichiran worth ¥1,000?', upvotes: 31, comments: 45, time: '1d ago', color: '#8b5cf6' },
  { id: '4', type: 'Tip', user: 'SoloEater', title: 'Counter-only ramen shops near Shibuya station', upvotes: 28, comments: 8, time: '1d ago', color: '#3b82f6' },
];

export default function CommunityTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity style={styles.postBtn}>
          <Text style={styles.postBtnText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['All', 'Tips', 'Deals', 'Discussions'].map((tab, i) => (
          <TouchableOpacity key={tab} style={[styles.tab, i === 0 && styles.tabActive]}>
            <Text style={[styles.tabText, i === 0 && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={POSTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, { backgroundColor: item.color + '20' }]}>
                <Text style={[styles.typeText, { color: item.color }]}>{item.type}</Text>
              </View>
              <Text style={styles.meta}>{item.user} · {item.time}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardActions}>
              <Text style={styles.action}>↗ {item.upvotes}</Text>
              <Text style={styles.action}>💬 {item.comments}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  postBtn: { backgroundColor: '#22c55e', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  postBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
  tab: { backgroundColor: '#f3f4f6', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tabActive: { backgroundColor: '#22c55e' },
  tabText: { fontSize: 13, color: '#6b7280' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '600' },
  meta: { fontSize: 12, color: '#9ca3af' },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 16, marginTop: 10 },
  action: { fontSize: 13, color: '#6b7280' },
});
