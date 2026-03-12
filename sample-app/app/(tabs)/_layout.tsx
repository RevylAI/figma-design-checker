import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';

function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabIcon, focused && styles.tabIconActive]} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.inkBlack,
        tabBarInactiveTintColor: Colors.gray,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Shop" />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Search" />,
        }}
      />
      <Tabs.Screen
        name="specimens"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Specimens" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Account" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.paperWhite,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 60,
  },
  tabIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  tabIconActive: {
    backgroundColor: Colors.stickerGreen,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.gray,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: Colors.inkBlack,
  },
});
