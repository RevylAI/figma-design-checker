import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Incident } from '../types';
import { categoryEmoji, categoryLabel, colors, severityColor } from '../theme';

type Props = {
  incident: Incident;
  onPress: () => void;
  compact?: boolean;
};

export function IncidentCard({ incident, onPress, compact }: Props) {
  const accent = severityColor[incident.severity];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && { opacity: 0.88 },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.emoji}>{categoryEmoji[incident.category]}</Text>
          <Text style={styles.category}>{categoryLabel[incident.category]}</Text>
          {incident.isLive && (
            <View style={styles.live}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
          <Text style={styles.meta}>
            {incident.distanceMi.toFixed(1)} mi · {incident.timeAgo}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {incident.title}
        </Text>
        {!compact && (
          <Text style={styles.address} numberOfLines={1}>
            {incident.address} · {incident.neighborhood}
          </Text>
        )}
        <View style={styles.bottomRow}>
          <Text style={styles.viewers}>
            {incident.viewers.toLocaleString()} watching
          </Text>
          <Text style={[styles.updated, { color: accent }]}>
            Updated {incident.updatedAgo} ago
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cardCompact: {
    marginBottom: 8,
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  emoji: {
    fontSize: 13,
  },
  category: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,45,45,0.18)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  liveText: {
    color: colors.redSoft,
    fontSize: 10,
    fontWeight: '800',
  },
  meta: {
    marginLeft: 'auto',
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 4,
  },
  address: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewers: {
    color: colors.textDim,
    fontSize: 12,
  },
  updated: {
    fontSize: 12,
    fontWeight: '600',
  },
});
