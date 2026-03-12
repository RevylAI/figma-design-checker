import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

export default function AccountScreen() {
  const [activeSection, setActiveSection] = useState<'orders' | 'settings'>('orders');
  const router = useRouter();
  const { orders } = useCart();

  const totalOrders = orders.length;
  const totalBugs = orders.reduce((sum, o) => sum + o.itemCount, 0);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return Colors.stickerGreen;
      case 'Shipped':
        return Colors.mangoOrange;
      case 'Processing':
        return Colors.mangoYellow;
      default:
        return Colors.gray;
    }
  };

  const formatSpent = (amount: number) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Account</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🐛</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Bug Collector</Text>
            <Text style={styles.profileEmail}>collector@bugbazaar.com</Text>
          </View>
          {totalOrders > 0 && (
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalOrders}</Text>
            <Text style={styles.statLabel}>ORDERS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalBugs}</Text>
            <Text style={styles.statLabel}>BUGS</Text>
          </View>
          <View style={[styles.statBox, totalSpent > 0 && { backgroundColor: Colors.stickerGreen }]}>
            <Text style={styles.statNumber}>{formatSpent(totalSpent)}</Text>
            <Text style={styles.statLabel}>SPENT</Text>
          </View>
        </View>

        {/* Section Tabs */}
        <View style={styles.sectionTabs}>
          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'orders' && styles.sectionTabActive]}
            onPress={() => setActiveSection('orders')}
          >
            <Text
              style={[
                styles.sectionTabText,
                activeSection === 'orders' && styles.sectionTabTextActive,
              ]}
            >
              Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'settings' && styles.sectionTabActive]}
            onPress={() => setActiveSection('settings')}
          >
            <Text
              style={[
                styles.sectionTabText,
                activeSection === 'settings' && styles.sectionTabTextActive,
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {activeSection === 'orders' ? (
          <View>
            {orders.length === 0 ? (
              <View style={styles.emptyOrders}>
                <Text style={styles.emptyEmoji}>📦</Text>
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptySubtitle}>
                  Your order history will appear here
                </Text>
              </View>
            ) : (
              orders.map(order => (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderItem}
                  onPress={() => router.push(`/order/${order.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.orderTop}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <View
                      style={[styles.orderStatus, { backgroundColor: statusColor(order.status) }]}
                    >
                      <Text style={styles.orderStatusText}>{order.status}</Text>
                    </View>
                  </View>
                  <View style={styles.orderBottom}>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={styles.orderDetail}>
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} · ${order.total.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.orderChevron}>
                    <Text style={styles.orderChevronText}>›</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <View>
            {[
              { label: 'Edit Profile', icon: '✏️' },
              { label: 'Shipping Addresses', icon: '📦' },
              { label: 'Payment Methods', icon: '💳' },
              { label: 'Notifications', icon: '🔔' },
              { label: 'Help & Support', icon: '❓' },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.settingsItem}
                onPress={() => Alert.alert(item.label, 'This is a demo feature.')}
                activeOpacity={0.7}
              >
                <Text style={styles.settingsIcon}>{item.icon}</Text>
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Text style={styles.settingsChevron}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => Alert.alert('Logged Out', 'You have been logged out (demo).')}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paperWhite,
  },
  headerRow: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.inkBlack,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl + 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.stickerGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  profileEmail: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: Colors.mangoOrange,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    fontFamily: Fonts.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.s,
    marginBottom: Spacing.l,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.inkBlack,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    letterSpacing: 1,
    fontFamily: Fonts.body,
    marginTop: 2,
    opacity: 0.6,
  },
  sectionTabs: {
    flexDirection: 'row',
    gap: Spacing.s,
    marginBottom: Spacing.m,
  },
  sectionTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
  },
  sectionTabActive: {
    backgroundColor: Colors.inkBlack,
  },
  sectionTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  sectionTabTextActive: {
    color: Colors.paperWhite,
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.m,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.inkBlack,
    marginBottom: Spacing.s,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  orderItem: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: Spacing.m,
    marginBottom: Spacing.s,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  orderStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    fontFamily: Fonts.body,
  },
  orderChevron: {
    position: 'absolute',
    right: Spacing.m,
    top: '50%',
    marginTop: -11,
  },
  orderChevronText: {
    fontSize: 22,
    color: Colors.gray,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.gray,
  },
  orderDetail: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.priceGray,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  settingsIcon: {
    fontSize: 20,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.inkBlack,
  },
  settingsChevron: {
    fontSize: 22,
    color: Colors.gray,
  },
  logoutBtn: {
    marginTop: Spacing.l,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FF4444',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4444',
  },
});
