import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MOCK_ALERT_PREFS, MOCK_INCIDENTS } from '../data/mockIncidents';
import { colors, severityColor } from '../theme';

export function AlertsScreen() {
  const [prefs, setPrefs] = useState(MOCK_ALERT_PREFS);
  const recent = [...MOCK_INCIDENTS]
    .sort((a, b) => a.distanceMi - b.distanceMi)
    .slice(0, 5);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.sub}>
          Push notifications for what matters around you
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Notification preferences</Text>
        {prefs.map((p) => (
          <Pressable
            key={p.id}
            style={styles.prefRow}
            onPress={() =>
              setPrefs((prev) =>
                prev.map((x) =>
                  x.id === p.id ? { ...x, enabled: !x.enabled } : x,
                ),
              )
            }
          >
            <Text style={styles.prefLabel}>{p.label}</Text>
            <View
              style={[
                styles.toggle,
                p.enabled ? styles.toggleOn : styles.toggleOff,
              ]}
            >
              <View
                style={[
                  styles.knob,
                  p.enabled ? styles.knobOn : styles.knobOff,
                ]}
              />
            </View>
          </Pressable>
        ))}

        <Text style={[styles.section, { marginTop: 28 }]}>
          Recent push history
        </Text>
        {recent.map((inc) => (
          <View key={inc.id} style={styles.pushCard}>
            <View
              style={[
                styles.pushDot,
                { backgroundColor: severityColor[inc.severity] },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.pushTitle}>{inc.title}</Text>
              <Text style={styles.pushMeta}>
                {inc.distanceMi.toFixed(1)} mi · {inc.timeAgo} ago · mock
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Mock data only — no real notifications are sent from this demo
            build.
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
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  prefLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.red,
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: colors.border,
    alignItems: 'flex-start',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  knobOn: {},
  knobOff: {},
  pushCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  pushDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  pushTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  pushMeta: {
    color: colors.textDim,
    fontSize: 12,
  },
  note: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(76,141,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76,141,255,0.3)',
  },
  noteText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
