import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RESTAURANTS: Record<string, any> = {
  '1': { name: 'Matsuya Shinjuku', nameJa: '松屋 新宿店', cuisine: ['Japanese', 'Gyudon'], price: '¥550', score: 4.5, distance: '250m', reviews: 342, worthIt: 87 },
  '2': { name: 'Yayoiken Shibuya', nameJa: 'やよい軒 渋谷店', cuisine: ['Japanese', 'Teishoku'], price: '¥780', score: 4.3, distance: '480m', reviews: 218, worthIt: 82 },
};

const MENU = [
  { name: 'Beef Bowl (Regular)', price: '¥450' },
  { name: 'Beef Bowl (Large)', price: '¥550' },
  { name: 'Curry Rice', price: '¥490' },
  { name: 'Beef Curry Set', price: '¥580', tag: 'Lunch Special' },
  { name: 'Breakfast Set A', price: '¥350' },
];

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const r = RESTAURANTS[id || '1'] || RESTAURANTS['1'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity><Text style={{ fontSize: 22 }}>♡</Text></TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}><Text style={{ fontSize: 40 }}>📷</Text></View>

        {/* Info */}
        <Text style={styles.name}>{r.name}</Text>
        <Text style={styles.nameJa}>{r.nameJa}</Text>
        <View style={styles.cuisineRow}>
          {r.cuisine.map((c: string) => (
            <View key={c} style={styles.cuisineTag}><Text style={styles.cuisineText}>{c}</Text></View>
          ))}
        </View>

        {/* Purpose badges */}
        <View style={styles.purposeRow}>
          <View style={[styles.purposeBadge, { backgroundColor: '#dcfce7' }]}><Text style={styles.purposeText}>🍱 Daily Eats</Text></View>
          <View style={[styles.purposeBadge, { backgroundColor: '#dcfce7' }]}><Text style={styles.purposeText}>🧑‍💻 Solo Dining</Text></View>
          <View style={[styles.purposeBadge, { backgroundColor: '#fef9c3' }]}><Text style={styles.purposeText}>🌙 Late Night</Text></View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statBig}>{r.price}</Text><Text style={styles.statSm}>Avg/person</Text></View>
          <View style={styles.stat}><Text style={styles.statBig}>{r.distance}</Text><Text style={styles.statSm}>Distance</Text></View>
          <View style={styles.stat}><Text style={styles.statBig}>{r.reviews}</Text><Text style={styles.statSm}>Reviews</Text></View>
        </View>

        {/* Value score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNum}>{r.score}</Text>
          <Text style={styles.scoreLabel}>Value Score</Text>
          <View style={styles.worthItBar}>
            <View style={[styles.worthItFill, { width: `${r.worthIt}%` }]} />
          </View>
          <Text style={styles.worthItText}>👍 {r.worthIt}% said "Worth it"</Text>
        </View>

        {/* AI Summary */}
        <View style={styles.aiCard}>
          <Text style={styles.aiTitle}>✨ AI Summary</Text>
          <Text style={styles.aiText}>
            Affordable gyudon chain with consistently generous portions. Great for quick solo meals near the station.
          </Text>
          <View style={styles.aiTags}>
            <View style={styles.aiTag}><Text style={styles.aiTagText}>Beef Bowl (¥450)</Text></View>
            <View style={styles.aiTag}><Text style={styles.aiTagText}>Curry Set (¥580)</Text></View>
          </View>
        </View>

        {/* Menu */}
        <Text style={styles.sectionTitle}>Menu <Text style={styles.aiLabel}>✨ AI Extracted</Text></Text>
        {MENU.map((item, i) => (
          <View key={i} style={styles.menuItem}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.menuName}>{item.name}</Text>
              {item.tag && <View style={styles.lunchTag}><Text style={styles.lunchTagText}>{item.tag}</Text></View>}
            </View>
            <Text style={styles.menuPrice}>{item.price}</Text>
          </View>
        ))}

        {/* Camera CTA */}
        <TouchableOpacity style={styles.cameraCta}>
          <Text style={styles.cameraText}>📷 Scan Menu Photo</Text>
          <Text style={styles.cameraSubtext}>AI will extract items & prices</Text>
        </TouchableOpacity>

        {/* Quick rating */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Was it worth it?</Text>
          <View style={styles.ratingBtns}>
            <TouchableOpacity style={styles.yesBtn}><Text style={styles.yesBtnText}>👍 Yes!</Text></TouchableOpacity>
            <TouchableOpacity style={styles.noBtn}><Text style={styles.noBtnText}>👎 Not really</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { padding: 4 },
  backText: { fontSize: 16, color: '#22c55e', fontWeight: '600' },
  hero: { height: 180, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 16, marginTop: 16 },
  nameJa: { fontSize: 14, color: '#6b7280', paddingHorizontal: 16, marginTop: 2 },
  cuisineRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginTop: 8 },
  cuisineTag: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cuisineText: { fontSize: 12, color: '#4b5563' },
  purposeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, marginTop: 10 },
  purposeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  purposeText: { fontSize: 12, fontWeight: '500' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e5e7eb', marginTop: 14 },
  stat: { flex: 1, alignItems: 'center' },
  statBig: { fontSize: 18, fontWeight: '700' },
  statSm: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  scoreCard: { alignItems: 'center', paddingVertical: 16, marginHorizontal: 16, marginTop: 12, backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16 },
  scoreNum: { fontSize: 36, fontWeight: 'bold', color: '#22c55e' },
  scoreLabel: { fontSize: 13, color: '#6b7280' },
  worthItBar: { width: '100%', height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  worthItFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 4 },
  worthItText: { fontSize: 13, fontWeight: '600', color: '#22c55e', marginTop: 6 },
  aiCard: { margin: 16, backgroundColor: '#faf5ff', borderWidth: 1, borderColor: '#e9d5ff', borderRadius: 14, padding: 16 },
  aiTitle: { fontSize: 15, fontWeight: '600', color: '#7c3aed', marginBottom: 8 },
  aiText: { fontSize: 13, lineHeight: 20, color: '#374151' },
  aiTags: { flexDirection: 'row', gap: 6, marginTop: 10 },
  aiTag: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  aiTagText: { fontSize: 11, color: '#166534', fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  aiLabel: { fontSize: 11, color: '#7c3aed', fontWeight: '500' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  menuName: { fontSize: 14 },
  menuPrice: { fontSize: 14, fontWeight: '700' },
  lunchTag: { backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  lunchTagText: { fontSize: 10, color: '#92400e', fontWeight: '600' },
  cameraCta: { margin: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', borderRadius: 14, padding: 20, alignItems: 'center' },
  cameraText: { fontSize: 15, fontWeight: '600', color: '#22c55e' },
  cameraSubtext: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  ratingCard: { margin: 16, backgroundColor: '#f0fdf4', borderRadius: 14, padding: 20, alignItems: 'center' },
  ratingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  ratingBtns: { flexDirection: 'row', gap: 12 },
  yesBtn: { backgroundColor: '#22c55e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  yesBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  noBtn: { backgroundColor: '#e5e7eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  noBtnText: { color: '#374151', fontSize: 15, fontWeight: '600' },
});
