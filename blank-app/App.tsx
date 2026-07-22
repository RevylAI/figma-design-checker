import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { IncidentDetailScreen } from './src/screens/IncidentDetailScreen';
import { AlertsScreen } from './src/screens/AlertsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import type { TabId } from './src/types';
import { colors } from './src/theme';

type Route =
  | { name: 'tabs' }
  | { name: 'incident'; id: string };

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'map', label: 'Map', icon: '🗺' },
  { id: 'alerts', label: 'Alerts', icon: '⚡' },
  { id: 'broadcast', label: 'Go Live', icon: '⏺' },
  { id: 'you', label: 'You', icon: '👤' },
];

function BroadcastScreen() {
  return (
    <View style={styles.broadcast}>
      <View style={styles.broadcastOrb}>
        <Text style={styles.broadcastOrbText}>⏺</Text>
      </View>
      <Text style={styles.broadcastTitle}>Go Live</Text>
      <Text style={styles.broadcastBody}>
        Broadcast video from an unfolding incident. This build uses mock data
        only — camera capture is disabled.
      </Text>
      <Pressable style={styles.broadcastBtn}>
        <Text style={styles.broadcastBtnText}>Start mock broadcast</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabId>('map');
  const [route, setRoute] = useState<Route>({ name: 'tabs' });

  if (route.name === 'incident') {
    return (
      <IncidentDetailScreen
        incidentId={route.id}
        onBack={() => setRoute({ name: 'tabs' })}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>
        {tab === 'map' && (
          <HomeScreen
            onOpenIncident={(id) => setRoute({ name: 'incident', id })}
          />
        )}
        {tab === 'alerts' && <AlertsScreen />}
        {tab === 'broadcast' && <BroadcastScreen />}
        {tab === 'you' && <ProfileScreen />}
      </View>
      <SafeAreaView style={styles.tabSafe}>
        <View style={styles.tabBar}>
          {TABS.map((t) => {
            const active = tab === t.id;
            const isLive = t.id === 'broadcast';
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={styles.tabItem}
              >
                <View
                  style={[
                    styles.tabIconWrap,
                    isLive && styles.tabLive,
                    active && !isLive && styles.tabActive,
                  ]}
                >
                  <Text style={styles.tabIcon}>{t.icon}</Text>
                </View>
                <Text
                  style={[styles.tabLabel, active && styles.tabLabelActive]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1 },
  tabSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7,8,10,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    zIndex: 40,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabIconWrap: {
    width: 36,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  tabLive: { backgroundColor: colors.red },
  tabIcon: { fontSize: 15 },
  tabLabel: { color: colors.textDim, fontSize: 10, fontWeight: '700' },
  tabLabelActive: { color: colors.text },
  broadcast: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  broadcastOrb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,45,45,0.18)',
    borderWidth: 2,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  broadcastOrbText: { fontSize: 36, color: colors.red },
  broadcastTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  broadcastBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  broadcastBtn: {
    backgroundColor: colors.red,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  broadcastBtnText: { color: colors.white, fontWeight: '800', fontSize: 15 },
});
