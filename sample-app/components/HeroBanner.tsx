import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Fonts } from '../constants/theme';
import HalftoneOverlay from './HalftoneOverlay';

export default function HeroBanner() {
  return (
    <View style={styles.hero}>
      <View style={styles.stickerCard}>
        <HalftoneOverlay dotSize={1} spacing={4} opacity={0.12} />
        <View style={styles.stickerBlob} />
        <View style={styles.stickerContent}>
          <Text style={styles.heroTitle}>
            {'Rare Species\nCollection'}
          </Text>
          <Text style={styles.heroSubtitle}>SUPERIOR SPECIMENS</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: Spacing.m,
  },
  stickerCard: {
    backgroundColor: Colors.stickerGreen,
    borderRadius: 24,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 28,
    padding: Spacing.l,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: Colors.stickerGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  stickerBlob: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 9999,
    opacity: 0.15,
  },
  stickerContent: {
    zIndex: 2,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: Spacing.s,
    transform: [{ rotate: '-2deg' }],
    color: Colors.inkBlack,
  },
  heroSubtitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.inkBlack,
  },
});
