import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Incident } from '../types';
import { colors, severityColor } from '../theme';

type Props = {
  incidents: Incident[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

function PulseMarker({
  incident,
  selected,
  onPress,
}: {
  incident: Incident;
  selected: boolean;
  onPress: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (incident.severity === 'stale') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [incident.severity, pulse]);

  const color = severityColor[incident.severity];
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });
  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.markerWrap,
        {
          left: `${incident.mapX * 100}%`,
          top: `${incident.mapY * 100}%`,
        },
      ]}
      hitSlop={12}
    >
      {incident.severity !== 'stale' && (
        <Animated.View
          style={[
            styles.pulse,
            { backgroundColor: color, transform: [{ scale }], opacity },
          ]}
        />
      )}
      <View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            borderColor: selected ? colors.white : color,
            width: selected ? 18 : 12,
            height: selected ? 18 : 12,
            borderRadius: selected ? 9 : 6,
          },
        ]}
      />
      {incident.isLive && (
        <View style={styles.liveTag}>
          <Text style={styles.liveTagText}>LIVE</Text>
        </View>
      )}
    </Pressable>
  );
}

export function MapCanvas({ incidents, selectedId, onSelect }: Props) {
  return (
    <View style={styles.map}>
      {/* Fake street grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[styles.hStreet, { top: `${10 + i * 11}%` }]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[styles.vStreet, { left: `${12 + i * 14}%` }]}
        />
      ))}

      {/* Illuminated “active users” streets */}
      <View style={[styles.glowStreet, { top: '42%', left: '18%', width: '55%' }]} />
      <View style={[styles.glowStreetV, { left: '48%', top: '22%', height: '48%' }]} />
      <View style={[styles.glowStreet, { top: '64%', left: '30%', width: '40%' }]} />

      {/* Blocks / parks */}
      <View style={[styles.block, { top: '18%', left: '20%', width: 70, height: 48 }]} />
      <View style={[styles.park, { top: '55%', left: '58%', width: 56, height: 56 }]} />
      <View style={[styles.block, { top: '70%', left: '16%', width: 90, height: 40 }]} />

      {/* You are here */}
      <View style={styles.youWrap}>
        <View style={styles.youRing} />
        <View style={styles.youDot} />
      </View>

      {incidents.map((incident) => (
        <PulseMarker
          key={incident.id}
          incident={incident}
          selected={selectedId === incident.id}
          onPress={() => onSelect(incident.id)}
        />
      ))}

      <View style={styles.scaleBadge}>
        <Text style={styles.scaleText}>0.5 mi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.map,
    overflow: 'hidden',
  },
  hStreet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.mapLine,
  },
  vStreet: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.mapLine,
  },
  glowStreet: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(76,141,255,0.35)',
  },
  glowStreetV: {
    position: 'absolute',
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(76,141,255,0.28)',
  },
  block: {
    position: 'absolute',
    backgroundColor: colors.mapGlow,
    borderRadius: 4,
    opacity: 0.7,
  },
  park: {
    position: 'absolute',
    backgroundColor: '#1A2E24',
    borderRadius: 8,
    opacity: 0.85,
  },
  youWrap: {
    position: 'absolute',
    left: '46%',
    top: '48%',
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(76,141,255,0.25)',
  },
  youDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerWrap: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dot: {
    borderWidth: 2,
    zIndex: 2,
  },
  liveTag: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: colors.red,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    zIndex: 3,
  },
  liveTagText: {
    color: colors.white,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  scaleBadge: {
    position: 'absolute',
    right: 14,
    bottom: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scaleText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
