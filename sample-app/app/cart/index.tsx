import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 32 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some bugs to get started!</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.shopBtnText}>BROWSE BUGS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImageBox}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Order Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
                </Text>
                <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={[styles.summaryValue, shipping === 0 && styles.freeText]}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              {shipping > 0 && (
                <Text style={styles.freeShippingNote}>
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                </Text>
              )}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push('/checkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>CHECKOUT · ${grandTotal.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  headerTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.m,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 24,
    color: Colors.inkBlack,
    marginBottom: Spacing.s,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.l,
  },
  shopBtn: {
    backgroundColor: Colors.stickerGreen,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  shopBtnText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.inkBlack,
    fontFamily: Fonts.body,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  itemImageBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.inkBlack,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.priceGray,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 14,
    color: Colors.gray,
  },
  summarySection: {
    marginTop: Spacing.l,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: Spacing.m,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.priceGray,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  freeText: {
    color: Colors.stickerGreen,
  },
  freeShippingNote: {
    fontSize: 11,
    color: Colors.mangoOrange,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    marginTop: 4,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  totalValue: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  footer: {
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: Colors.paperWhite,
  },
  checkoutBtn: {
    backgroundColor: Colors.inkBlack,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: Colors.stickerGreen,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
