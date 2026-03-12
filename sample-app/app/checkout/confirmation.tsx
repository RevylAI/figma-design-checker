import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../../constants/theme';

export default function ConfirmationScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  const orderId = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkCircle,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.checkEmoji}>🪲</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>Your specimens are on their way</Text>

          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>ORDER ID</Text>
            <Text style={styles.orderIdValue}>{orderId}</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📦</Text>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Estimated Delivery</Text>
                <Text style={styles.detailValue}>3-5 business days</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📧</Text>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Confirmation Email</Text>
                <Text style={styles.detailValue}>Sent to collector@bugbazaar.com</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🔔</Text>
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Tracking</Text>
                <Text style={styles.detailValue}>Updates will be sent via notification</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(tabs)/account')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryBtnText}>VIEW ORDERS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paperWhite,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.stickerGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.l,
    shadowColor: Colors.stickerGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  checkEmoji: {
    fontSize: 48,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 32,
    color: Colors.inkBlack,
    marginBottom: Spacing.s,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.l,
  },
  orderIdBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  orderIdLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  orderIdValue: {
    fontFamily: Fonts.body,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    marginTop: 4,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: Spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  detailIcon: {
    fontSize: 24,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  detailValue: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 36,
  },
  footer: {
    padding: Spacing.m,
    gap: Spacing.s,
  },
  primaryBtn: {
    backgroundColor: Colors.inkBlack,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.stickerGreen,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.inkBlack,
  },
  secondaryBtnText: {
    color: Colors.inkBlack,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
