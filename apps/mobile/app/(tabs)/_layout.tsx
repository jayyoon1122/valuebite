import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Map: '🗺️', Discover: '🔍', Purpose: '🎯', Community: '💬', Profile: '👤',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name] || '📌'}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 4 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Map', tabBarIcon: ({ focused }) => <TabIcon name="Map" focused={focused} /> }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: ({ focused }) => <TabIcon name="Discover" focused={focused} /> }} />
      <Tabs.Screen name="purpose" options={{ title: 'Purpose', tabBarIcon: ({ focused }) => <TabIcon name="Purpose" focused={focused} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ focused }) => <TabIcon name="Community" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }} />
    </Tabs>
  );
}
