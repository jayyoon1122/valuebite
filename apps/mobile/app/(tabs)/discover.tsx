import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const TRENDING = [
  { id: '1', name: 'Fuji Soba', score: 4.7, reason: 'Most reviewed this week', reviews: 501 },
  { id: '2', name: 'Saizeriya', score: 4.6, reason: 'Rising value score', reviews: 275 },
  { id: '3', name: 'Matsuya', score: 4.5, reason: 'Most "worth it" votes', reviews: 342 },
];

const CATEGORIES = [
  { key: 'ramen', label: 'Ramen', icon: '🍜', count: 42 },
  { key: 'gyudon', label: 'Gyudon', icon: '🥩', count: 28 },
  { key: 'curry', label: 'Curry', icon: '🍛', count: 35 },
  { key: 'soba', label: 'Soba/Udon', icon: '🍝', count: 23 },
  { key: 'teishoku', label: 'Teishoku', icon: '🍱', count: 31 },
  { key: 'italian', label: 'Italian', icon: '🍕', count: 18 },
];

export default function DiscoverTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput style={styles.searchInput} placeholder="Search restaurants, cuisines..." placeholderTextColor="#9ca3af" />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Trending */}
            <Text style={styles.sectionTitle}>🔥 Trending This Week</Text>
            {TRENDING.map((item) => (
              <TouchableOpacity key={item.id} style={styles.trendingCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trendingName}>{item.name}</Text>
                  <Text style={styles.trendingReason}>{item.reason}</Text>
                </View>
                <View style={styles.trendingScore}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                  <Text style={styles.reviewCount}>{item.reviews} reviews</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Browse by cuisine */}
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Browse by Cuisine</Text>
          </>
        }
        data={CATEGORIES}
        numColumns={2}
        keyExtractor={(item) => item.key}
        columnWrapperStyle={styles.categoryRow}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryLabel}>{item.label}</Text>
            <Text style={styles.categoryCount}>{item.count} places</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 24, fontWeight: 'bold' },
  searchWrapper: { paddingHorizontal: 16, paddingVertical: 8 },
  searchInput: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 },
  content: { paddingHorizontal: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 8 },
  trendingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 8 },
  trendingName: { fontSize: 15, fontWeight: '600' },
  trendingReason: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  trendingScore: { alignItems: 'center' },
  scoreText: { fontSize: 20, fontWeight: 'bold', color: '#22c55e' },
  reviewCount: { fontSize: 10, color: '#9ca3af' },
  categoryRow: { gap: 10, marginBottom: 10 },
  categoryCard: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, alignItems: 'center' },
  categoryIcon: { fontSize: 28 },
  categoryLabel: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  categoryCount: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
});
