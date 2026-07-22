import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getIncidentById } from '../data/mockIncidents';
import { categoryEmoji, categoryLabel, colors, severityColor } from '../theme';

type Props = {
  incidentId: string;
  onBack: () => void;
};

export function IncidentDetailScreen({ incidentId, onBack }: Props) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return (
      <View style={styles.root}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.missing}>Incident not found</Text>
      </View>
    );
  }

  const accent = severityColor[incident.severity];

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { borderBottomColor: accent }]}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Map</Text>
        </Pressable>
        <View style={styles.heroMeta}>
          <Text style={styles.emoji}>{categoryEmoji[incident.category]}</Text>
          <Text style={styles.category}>{categoryLabel[incident.category]}</Text>
          {incident.isLive && (
            <View style={styles.live}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{incident.title}</Text>
        <Text style={styles.address}>
          {incident.address} · {incident.neighborhood}
        </Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>
            {incident.distanceMi.toFixed(1)} mi away
          </Text>
          <Text style={styles.statDot}>·</Text>
          <Text style={styles.stat}>{incident.timeAgo} ago</Text>
          <Text style={styles.statDot}>·</Text>
          <Text style={[styles.stat, { color: accent }]}>
            Updated {incident.updatedAgo}
          </Text>
        </View>
        <Text style={styles.viewers}>
          {incident.viewers.toLocaleString()} people watching
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>Summary</Text>
        <Text style={styles.summary}>{incident.summary}</Text>

        <Text style={styles.section}>Timeline</Text>
        {incident.updates.map((u, idx) => (
          <View key={u.id} style={styles.timelineRow}>
            <View style={styles.timelineRail}>
              <View style={[styles.timelineDot, { backgroundColor: accent }]} />
              {idx < incident.updates.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.timelineBody}>
              <Text style={styles.timelineTime}>{u.timeAgo} ago</Text>
              <Text style={styles.timelineText}>{u.text}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.section}>
          Comments ({incident.comments.length})
        </Text>
        {incident.comments.length === 0 ? (
          <Text style={styles.empty}>No comments yet — be the first.</Text>
        ) : (
          incident.comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <View style={styles.commentHead}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {c.user.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.user}>{c.user}</Text>
                <Text style={styles.commentTime}>{c.timeAgo}</Text>
              </View>
              <Text style={styles.commentText}>{c.text}</Text>
              <Text style={styles.likes}>♥ {c.likes}</Text>
            </View>
          ))
        )}

        <View style={styles.actions}>
          <Pressable style={[styles.actionBtn, styles.primaryBtn]}>
            <Text style={styles.primaryBtnText}>Go Live Nearby</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Share Alert</Text>
          </Pressable>
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
  hero: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 18,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingVertical: 4,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emoji: { fontSize: 16 },
  category: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,45,45,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  liveText: {
    color: colors.redSoft,
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 6,
  },
  address: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  stat: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  statDot: {
    color: colors.textDim,
  },
  viewers: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 10,
  },
  summary: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineRail: {
    width: 18,
    alignItems: 'center',
  },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 2,
    minHeight: 28,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: 14,
  },
  timelineTime: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  empty: {
    color: colors.textDim,
    fontSize: 14,
    marginBottom: 12,
  },
  comment: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  commentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
  user: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  commentTime: {
    marginLeft: 'auto',
    color: colors.textDim,
    fontSize: 12,
  },
  commentText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  likes: {
    color: colors.textDim,
    fontSize: 12,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryBtn: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  missing: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});
