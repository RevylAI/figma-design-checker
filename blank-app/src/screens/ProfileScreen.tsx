import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { USER_LOCATION } from '../data/mockIncidents';
import { colors } from '../theme';

const STATS = [
  { label: 'Alerts viewed', value: '128' },
  { label: 'Lives shared', value: '3' },
  { label: 'Tips posted', value: '11' },
];

const FOLLOWS = [
  { name: 'SoHo', kind: 'Neighborhood' },
  { name: 'Home — W Broadway', kind: 'SafeZone' },
  { name: 'Office — Hudson Yards', kind: 'SafeZone' },
  { name: 'NYC Citywide', kind: 'City' },
];

export function ProfileScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
        <Text style={styles.name}>Citizen Demo</Text>
        <Text style={styles.loc}>{USER_LOCATION.label}</Text>
        <Text style={styles.badge}>Protect member · mock</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Communities you follow</Text>
        {FOLLOWS.map((f) => (
          <View key={f.name} style={styles.followRow}>
            <View>
              <Text style={styles.followName}>{f.name}</Text>
              <Text style={styles.followKind}>{f.kind}</Text>
            </View>
            <Text style={styles.following}>Following</Text>
          </View>
        ))}

        <Text style={styles.section}>About this build</Text>
        <View style={styles.about}>
          <Text style={styles.aboutText}>
            This is a mock rebuild of the Citizen neighborhood safety
            experience for a Revyl hot-reload demo. All incidents, comments,
            and viewers are fabricated. No scanners, location services, or
            network calls are used.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  loc: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    marginTop: 8,
    color: colors.redSoft,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  followName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  followKind: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  following: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '700',
  },
  about: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  aboutText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
});
