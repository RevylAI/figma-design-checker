/**
 * Progressive Citizen reveal for video demos.
 *
 * Bump DEMO_STAGE in App.tsx (0 → 10). All heavy components already live under
 * src/ — changing the stage only rewires composition, so hot reload stays fast.
 *
 *  0 blank canvas
 *  1 CITIZEN brand
 *  2 empty map
 *  3 map + markers
 *  4 location chrome
 *  5 alerts status chip
 *  6 Nearby sheet chrome
 *  7 first incident card
 *  8 full feed
 *  9 tab bar
 * 10 full interactive app
 */
import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MapCanvas } from '../components/MapCanvas';
import { IncidentCard } from '../components/IncidentCard';
import { HomeScreen } from '../screens/HomeScreen';
import { IncidentDetailScreen } from '../screens/IncidentDetailScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import {
  MOCK_INCIDENTS,
  USER_LOCATION,
  getCriticalNearby,
} from '../data/mockIncidents';
import type { TabId } from '../types';
import { colors } from '../theme';

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
        In the real Citizen app you can broadcast video from an unfolding
        incident. This demo build uses mock data only — camera capture is
        disabled.
      </Text>
      <Pressable style={styles.broadcastBtn}>
        <Text style={styles.broadcastBtnText}>Start mock broadcast</Text>
      </Pressable>
    </View>
  );
}

function ShellChrome({
  alertCount,
  showStatus,
}: {
  alertCount: number;
  showStatus: boolean;
}) {
  return (
    <>
      <View style={styles.topChrome} pointerEvents="box-none">
        <View style={styles.locationPill}>
          <Text style={styles.pin}>📍</Text>
          <View>
            <Text style={styles.locationLabel}>{USER_LOCATION.label}</Text>
            <Text style={styles.usersNearby}>
              {USER_LOCATION.nearbyUsers.toLocaleString()} Citizens nearby
            </Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <Pressable style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🔍</Text>
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🔔</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{alertCount}</Text>
            </View>
          </Pressable>
        </View>
      </View>
      {showStatus && (
        <View style={styles.statusWrap} pointerEvents="none">
          <View style={styles.statusChip}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{alertCount} Alerts Nearby</Text>
          </View>
        </View>
      )}
    </>
  );
}

export function DemoApp({ stage }: { stage: number }) {
  const { height } = useWindowDimensions();
  const alertCount = getCriticalNearby().length;
  const sheetHeight = Math.min(height * 0.42, 360);
  const sorted = [...MOCK_INCIDENTS].sort((a, b) => a.distanceMi - b.distanceMi);
  const [tab, setTab] = useState<TabId>('map');
  const [route, setRoute] = useState<Route>({ name: 'tabs' });

  if (stage <= 0) {
    return (
      <View style={styles.blank}>
        <Text style={styles.blankTitle}>Blank App</Text>
        <Text style={styles.blankSub}>
          Edit App.tsx — hot reload will update this screen.
        </Text>
        <ExpoStatusBar style="auto" />
      </View>
    );
  }

  if (stage === 1) {
    return (
      <View style={styles.brandRoot}>
        <ExpoStatusBar style="light" />
        <Text style={styles.brand}>CITIZEN</Text>
        <Text style={styles.tag}>Protect the world</Text>
      </View>
    );
  }

  if (stage === 2) {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="light" />
        <MapCanvas incidents={[]} selectedId={null} onSelect={() => {}} />
      </View>
    );
  }

  if (stage === 3) {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="light" />
        <MapCanvas
          incidents={MOCK_INCIDENTS}
          selectedId={MOCK_INCIDENTS[0]?.id}
          onSelect={() => {}}
        />
      </View>
    );
  }

  if (stage === 4) {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="light" />
        <MapCanvas
          incidents={MOCK_INCIDENTS}
          selectedId={MOCK_INCIDENTS[0]?.id}
          onSelect={() => {}}
        />
        <ShellChrome alertCount={alertCount} showStatus={false} />
      </View>
    );
  }

  if (stage === 5) {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="light" />
        <MapCanvas
          incidents={MOCK_INCIDENTS}
          selectedId={MOCK_INCIDENTS[0]?.id}
          onSelect={() => {}}
        />
        <ShellChrome alertCount={alertCount} showStatus />
      </View>
    );
  }

  if (stage === 6 || stage === 7 || stage === 8) {
    const cards =
      stage === 6 ? [] : stage === 7 ? sorted.slice(0, 1) : sorted;
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="light" />
        <MapCanvas
          incidents={MOCK_INCIDENTS}
          selectedId={sorted[0]?.id}
          onSelect={() => {}}
        />
        <ShellChrome alertCount={alertCount} showStatus />
        <View style={[styles.sheet, { height: sheetHeight }]}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Nearby</Text>
            <Text style={styles.sheetSub}>
              Sorted by distance · last 24 hours
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
          >
            {cards.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                compact
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  // stage >= 9 — tabs; stage >= 10 — incident navigation
  const openIncident =
    stage >= 10
      ? (id: string) => setRoute({ name: 'incident', id })
      : () => {};

  if (stage >= 10 && route.name === 'incident') {
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
        {tab === 'map' && <HomeScreen onOpenIncident={openIncident} />}
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
  blank: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  blankTitle: { fontSize: 28, fontWeight: '600', marginBottom: 8 },
  blankSub: { fontSize: 16, color: '#666', textAlign: 'center' },
  brandRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: colors.red,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
  },
  tag: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  topChrome: {
    position: 'absolute',
    top: 54,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10,12,16,0.82)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '68%',
  },
  pin: { fontSize: 16 },
  locationLabel: { color: colors.text, fontSize: 15, fontWeight: '700' },
  usersNearby: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  topActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10,12,16,0.82)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 16 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  statusWrap: {
    position: 'absolute',
    top: 118,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,45,45,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,45,0.45)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
  },
  statusText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingBottom: 72,
    zIndex: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 10,
    marginBottom: 8,
  },
  sheetHeader: { paddingHorizontal: 16, marginBottom: 8 },
  sheetTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  sheetSub: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  feedContent: { paddingHorizontal: 14, paddingBottom: 16 },
  tabSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7,8,10,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
