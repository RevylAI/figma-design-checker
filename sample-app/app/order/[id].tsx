import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useCart();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>📦</Text>
          <Text style={styles.notFoundText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor =
    order.status === 'Delivered'
      ? Colors.stickerGreen
      : order.status === 'Shipped'
      ? Colors.mangoOrange
      : Colors.mangoYellow;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>{order.date}</Text>

        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineStep}>
            <View style={[styles.timelineDot, { backgroundColor: Colors.stickerGreen }]} />
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineLabel}>Order Placed</Text>
              <Text style={styles.timelineDate}>{order.date}</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineStep}>
            <View
              style={[
                styles.timelineDot,
                {
                  backgroundColor:
                    order.status === 'Shipped' || order.status === 'Delivered'
                      ? Colors.stickerGreen
                      : Colors.lightGray,
                },
              ]}
            />
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineLabel}>Shipped</Text>
              <Text style={styles.timelineDate}>
                {order.status === 'Shipped' || order.status === 'Delivered'
                  ? 'In transit'
                  : 'Pending'}
              </Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineStep}>
            <View
              style={[
                styles.timelineDot,
                {
                  backgroundColor:
                    order.status === 'Delivered' ? Colors.stickerGreen : Colors.lightGray,
                },
              ]}
            />
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineLabel}>Delivered</Text>
              <Text style={styles.timelineDate}>
                {order.status === 'Delivered' ? 'Complete' : 'Estimated 3-5 days'}
              </Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <Text style={styles.sectionTitle}>ITEMS</Text>
        {order.items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemEmojiBox}>
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text
              style={[
                styles.totalValue,
                order.shipping === 0 && { color: Colors.stickerGreen },
              ]}
            >
              {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paperWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  headerTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: Spacing.m,
  },
  notFoundText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.inkBlack,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontFamily: Fonts.body,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    fontFamily: Fonts.body,
  },
  orderDate: {
    fontSize: 13,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginTop: 4,
    marginBottom: Spacing.l,
  },
  timeline: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: Spacing.m,
    marginBottom: Spacing.l,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  timelineDate: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.lightGray,
    marginLeft: 5,
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.m,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  itemEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: Fonts.display,
    fontSize: 14,
    color: Colors.inkBlack,
  },
  itemQty: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  totalsBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: Spacing.m,
    marginTop: Spacing.l,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.priceGray,
  },
  totalValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 10,
  },
  grandLabel: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  grandValue: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
});
