import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Home, Search, ShoppingBag, User, Shirt } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.gold.primary,
        tabBarInactiveTintColor: Colors.dark.secondaryText,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(18, 18, 18, 0.9)', 'rgba(18, 18, 18, 1)']}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="showroom"
        options={{
          title: 'Showroom',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.specialTab}>
              <LinearGradient
                colors={[Colors.gold.primary, Colors.roseGold.primary]}
                style={styles.specialTabGradient}
              />
              <Shirt size={size} color={Colors.dark.background} />
            </View>
          ),
          tabBarItemStyle: styles.specialTabItem,
        }}
      />
      <Tabs.Screen
        name="fitting-room"
        options={{
          title: 'Try On',
          tabBarIcon: ({ color, size }) => (
            <Shirt size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    elevation: 0,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  specialTab: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  specialTabGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  specialTabItem: {
    marginTop: -5,
  },
});