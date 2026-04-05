import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PURPOSES = [
  { key: 'all', label: 'All', icon: '' },
  { key: 'daily_eats', label: 'Daily Eats', icon: '🍱' },
  { key: 'good_value', label: 'Good Value', icon: '💰' },
  { key: 'date_night', label: 'Date Night', icon: '🥂' },
  { key: 'late_night', label: 'Late Night', icon: '🌙' },
  { key: 'solo_dining', label: 'Solo', icon: '🧑‍💻' },
];

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Matsuya Shinjuku', nameJa: '松屋 新宿店', cuisine: 'Gyudon', price: '¥550', score: 4.5, distance: '250m', reviews: 342 },
  { id: '2', name: 'Yayoiken Shibuya', nameJa: 'やよい軒 渋谷店', cuisine: 'Teishoku', price: '¥780', score: 4.3, distance: '480m', reviews: 218 },
  { id: '3', name: 'Hidakaya Ikebukuro', nameJa: '日高屋 池袋店', cuisine: 'Ramen', price: '¥490', score: 4.1, distance: '350m', reviews: 156 },
  { id: '4', name: 'CoCo Curry Shinjuku', nameJa: 'CoCo壱番屋', cuisine: 'Curry', price: '¥750', score: 3.9, distance: '620m', reviews: 89 },
  { id: '5', name: 'Fuji Soba Shinjuku', nameJa: '富士そば', cuisine: 'Soba', price: '¥420', score: 4.7, distance: '180m', reviews: 501 },
  { id: '6', name: 'Saizeriya Shibuya', nameJa: 'サイゼリヤ', cuisine: 'Italian', price: '¥650', score: 4.6, distance: '900m', reviews: 275 },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 4.5 ? '#22c55e' : score >= 3.5 ? '#eab308' : '#f97316';
  const label = score >= 4.5 ? 'Great Value' : score >= 3.5 ? 'Good Value' : 'Fair';
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeText, { color }]}>⭐ {score} {label}</Text>
    </View>
  );
}

export default function MapTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>ValueBite</Text>
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchText}>🔍 Search restaurants...</Text>
        </TouchableOpacity>
      </View>

      {/* Purpose chips */}
      <FlatList
        horizontal
        data={PURPOSES}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.chip, index === 0 && styles.chipActive]}>
            <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>
              {item.icon} {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Map View</Text>
        <Text style={styles.mapSubtext}>Tokyo, Japan</Text>
      </View>

      {/* Restaurant list */}
      <View style={styles.listHeader}>
        <View style={styles.dragHandle} />
        <Text style={styles.listTitle}>{MOCK_RESTAURANTS.length} restaurants nearby</Text>
      </View>

      <FlatList
        data={MOCK_RESTAURANTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/restaurant/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.nameJa}</Text>
                <Text style={styles.cardCuisine}>{item.cuisine}</Text>
              </View>
              <ScoreBadge score={item.score} />
            </View>
            <View style={styles.cardStats}>
              <Text style={styles.cardPrice}>{item.price}<Text style={styles.perPerson}>/person</Text></Text>
              <Text style={styles.cardStat}>📍 {item.distance}</Text>
              <Text style={styles.cardStat}>👍 {item.reviews}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#22c55e' },
  searchBar: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  searchText: { color: '#9ca3af', fontSize: 14 },
  chipContainer: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  chipActive: { backgroundColor: '#22c55e' },
  chipText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  mapPlaceholder: { height: 200, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 24 },
  mapSubtext: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  listHeader: { alignItems: 'center', paddingTop: 8 },
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db', marginBottom: 8 },
  listTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', paddingHorizontal: 16, alignSelf: 'flex-start' },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  cardCuisine: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
  cardPrice: { fontSize: 16, fontWeight: '700' },
  perPerson: { fontSize: 11, fontWeight: '400', color: '#6b7280' },
  cardStat: { fontSize: 13, color: '#6b7280' },
});
