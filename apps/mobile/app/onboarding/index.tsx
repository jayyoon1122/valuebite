import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const COUNTRIES = [
  { code: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
];

const PURPOSES = [
  { key: 'daily_eats', icon: '🍛', label: 'Daily Eats' },
  { key: 'good_value', icon: '🍱', label: 'Good Value' },
  { key: 'date_night', icon: '🥂', label: 'Date Night' },
  { key: 'family_dinner', icon: '👨‍👩‍👧‍👦', label: 'Family Dinner' },
  { key: 'late_night', icon: '🌙', label: 'Late Night' },
  { key: 'healthy_budget', icon: '🥗', label: 'Healthy & Budget' },
  { key: 'solo_dining', icon: '🧑‍💻', label: 'Solo Dining' },
  { key: 'group_party', icon: '🎉', label: 'Group & Party' },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  const togglePurpose = (key: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const finish = () => router.replace('/(tabs)');

  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.bigIcon}>🍽️</Text>
          <Text style={styles.welcomeTitle}>ValueBite</Text>
          <Text style={styles.welcomeSub}>Find amazing food at amazing prices</Text>
          <Text style={styles.welcomeDesc}>AI-powered budget restaurant discovery for smart diners worldwide</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(1)}>
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Select Your Country</Text>
          <Text style={styles.stepSub}>We'll show prices in your local currency</Text>
        </View>
        <FlatList
          data={COUNTRIES}
          numColumns={2}
          keyExtractor={(item) => item.code}
          columnWrapperStyle={styles.countryRow}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.countryCard, selectedCountry === item.code && styles.countrySelected]}
              onPress={() => setSelectedCountry(item.code)}
            >
              <Text style={styles.countryFlag}>{item.flag}</Text>
              <Text style={styles.countryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedCountry && styles.btnDisabled]}
            onPress={() => selectedCountry && setStep(2)}
          >
            <Text style={styles.primaryBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>What's Your Dining Style?</Text>
          <Text style={styles.stepSub}>Choose the types of meals you're looking for</Text>
        </View>
        <View style={styles.purposeGrid}>
          {PURPOSES.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.purposeCard, selectedPurposes.includes(p.key) && styles.purposeSelected]}
              onPress={() => togglePurpose(p.key)}
            >
              <Text style={styles.purposeIcon}>{p.icon}</Text>
              <Text style={styles.purposeLabel}>{p.label}</Text>
              {selectedPurposes.includes(p.key) && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(3)}>
            <Text style={styles.primaryBtnText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep(3)}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 3: Ready
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.bigIcon}>🎉</Text>
        <Text style={styles.welcomeTitle}>You're All Set!</Text>
        <Text style={styles.welcomeDesc}>Start discovering the best value restaurants near you</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={finish}>
          <Text style={styles.primaryBtnText}>Start Exploring</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={finish}>
          <Text style={styles.skipText}>Sign up later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  bigIcon: { fontSize: 64, marginBottom: 16 },
  welcomeTitle: { fontSize: 32, fontWeight: 'bold', color: '#22c55e' },
  welcomeSub: { fontSize: 18, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  welcomeDesc: { fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  primaryBtn: { backgroundColor: '#22c55e', paddingHorizontal: 48, paddingVertical: 14, borderRadius: 28, marginTop: 32 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.5 },
  stepHeader: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  stepTitle: { fontSize: 24, fontWeight: 'bold' },
  stepSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  listContent: { paddingHorizontal: 16 },
  countryRow: { gap: 12, marginBottom: 12 },
  countryCard: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 2, borderColor: '#f3f4f6', borderRadius: 14, padding: 20, alignItems: 'center' },
  countrySelected: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  countryFlag: { fontSize: 36 },
  countryName: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  footer: { paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center', gap: 12 },
  skipText: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, flex: 1 },
  purposeCard: { width: '47%', backgroundColor: '#f9fafb', borderWidth: 2, borderColor: '#f3f4f6', borderRadius: 14, padding: 16, alignItems: 'center' },
  purposeSelected: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  purposeIcon: { fontSize: 28 },
  purposeLabel: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  checkmark: { position: 'absolute', top: 8, right: 10, fontSize: 16, color: '#22c55e', fontWeight: 'bold' },
});
