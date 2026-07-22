import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MapCanvas } from '../components/MapCanvas';
import { IncidentCard } from '../components/IncidentCard';
import {
  MOCK_INCIDENTS,
  USER_LOCATION,
  getCriticalNearby,
} from '../data/mockIncidents';
import { colors } from '../theme';

type Props = {
  onOpenIncident: (id: string) => void;
};

export function HomeScreen({ onOpenIncident }: Props) {
  const { height } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_INCIDENTS[0]?.id ?? null,
  );
  const critical = useMemo(() => getCriticalNearby(), []);
  const sorted = useMemo(
    () => [...MOCK_INCIDENTS].sort((a, b) => a.distanceMi - b.distanceMi),
    [],
  );

  const sheetHeight = Math.min(height * 0.42, 360);
  const alertCount = critical.length;

  return (
    <View style={styles.root}>
      <MapCanvas
        incidents={MOCK_INCIDENTS}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          onOpenIncident(id);
        }}
      />

      {/* Top chrome */}
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

      {/* Safety status */}
      <View style={styles.statusWrap} pointerEvents="none">
        <View
          style={[
            styles.statusChip,
            alertCount > 0 ? styles.statusAlert : styles.statusSafe,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: alertCount > 0 ? colors.red : colors.green },
            ]}
          />
          <Text style={styles.statusText}>
            {alertCount > 0
              ? `${alertCount} Alerts Nearby`
              : 'No Alerts Nearby'}
          </Text>
        </View>
      </View>

      {/* Bottom sheet feed */}
      <View style={[styles.sheet, { height: sheetHeight }]}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Nearby</Text>
          <Text style={styles.sheetSub}>
            Sorted by distance · last 24 hours
          </Text>
        </View>
        <ScrollView
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
        >
          {sorted.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              compact
              onPress={() => {
                setSelectedId(incident.id);
                onOpenIncident(incident.id);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topChrome: {
    position: 'absolute',
    top: 54,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  pin: {
    fontSize: 16,
  },
  locationLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  usersNearby: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
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
  iconBtnText: {
    fontSize: 16,
  },
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
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
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
    borderWidth: 1,
  },
  statusAlert: {
    backgroundColor: 'rgba(255,45,45,0.16)',
    borderColor: 'rgba(255,45,45,0.45)',
  },
  statusSafe: {
    backgroundColor: 'rgba(46,229,157,0.14)',
    borderColor: 'rgba(46,229,157,0.4)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
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
  sheetHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sheetSub: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
});
