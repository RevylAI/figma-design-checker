import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

type Step = 'shipping' | 'payment' | 'review';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, totalItems, completeOrder } = useCart();
  const [step, setStep] = useState<Step>('shipping');

  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  });

  const [processing, setProcessing] = useState(false);

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  const stepNumber = step === 'shipping' ? 1 : step === 'payment' ? 2 : 3;

  // BUG: When Goliath Beetle is in cart, button total excludes tax
  const hasGoliath = items.some(item => item.id === 8);
  const buttonTotal = hasGoliath ? totalPrice + shippingCost : grandTotal;

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      completeOrder();
      router.replace('/checkout/confirmation');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'shipping') router.back();
            else if (step === 'payment') setStep('shipping');
            else setStep('payment');
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.stepIndicator}>{stepNumber}/3</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(stepNumber / 3) * 100}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 'shipping' && (
            <View>
              <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Bug Collector"
                  placeholderTextColor={Colors.gray}
                  value={shipping.name}
                  onChangeText={t => setShipping(s => ({ ...s, name: t }))}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123 Entomology Lane"
                  placeholderTextColor={Colors.gray}
                  value={shipping.address}
                  onChangeText={t => setShipping(s => ({ ...s, address: t }))}
                />
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 2 }]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Bugville"
                    placeholderTextColor={Colors.gray}
                    value={shipping.city}
                    onChangeText={t => setShipping(s => ({ ...s, city: t }))}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>ZIP</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="90210"
                    placeholderTextColor={Colors.gray}
                    value={shipping.zip}
                    onChangeText={t => setShipping(s => ({ ...s, zip: t }))}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.savedAddressBtn}
                onPress={() =>
                  setShipping({
                    name: 'Bug Collector',
                    address: '123 Entomology Lane',
                    city: 'Bugville',
                    zip: '90210',
                  })
                }
              >
                <Text style={styles.savedAddressText}>📍 Use saved address</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'payment' && (
            <View>
              <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor={Colors.gray}
                  value={payment.cardNumber}
                  onChangeText={t => setPayment(s => ({ ...s, cardNumber: t }))}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12/28"
                    placeholderTextColor={Colors.gray}
                    value={payment.expiry}
                    onChangeText={t => setPayment(s => ({ ...s, expiry: t }))}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={Colors.gray}
                    value={payment.cvv}
                    onChangeText={t => setPayment(s => ({ ...s, cvv: t }))}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name on Card</Text>
                <TextInput
                  style={styles.input}
                  placeholder="BUG COLLECTOR"
                  placeholderTextColor={Colors.gray}
                  value={payment.cardName}
                  onChangeText={t => setPayment(s => ({ ...s, cardName: t }))}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={styles.savedAddressBtn}
                onPress={() =>
                  setPayment({
                    cardNumber: '4242 4242 4242 4242',
                    expiry: '12/28',
                    cvv: '123',
                    cardName: 'BUG COLLECTOR',
                  })
                }
              >
                <Text style={styles.savedAddressText}>💳 Use demo card</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'review' && (
            <View>
              <Text style={styles.sectionTitle}>ORDER REVIEW</Text>

              {/* Items */}
              {items.map(item => (
                <View key={item.id} style={styles.reviewItem}>
                  <Text style={styles.reviewEmoji}>{item.emoji}</Text>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{item.name}</Text>
                    <Text style={styles.reviewQty}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.reviewPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}

              {/* Shipping Summary */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>SHIPPING TO</Text>
                <Text style={styles.reviewDetail}>{shipping.name || 'Bug Collector'}</Text>
                <Text style={styles.reviewDetail}>
                  {shipping.address || '123 Entomology Lane'}
                </Text>
                <Text style={styles.reviewDetail}>
                  {shipping.city || 'Bugville'}, {shipping.zip || '90210'}
                </Text>
              </View>

              {/* Payment Summary */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>PAYMENT</Text>
                <Text style={styles.reviewDetail}>
                  •••• •••• •••• {(payment.cardNumber || '4242').slice(-4)}
                </Text>
              </View>

              {/* Totals */}
              <View style={styles.totalsBox}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Shipping</Text>
                  <Text style={[styles.totalValue, shippingCost === 0 && { color: Colors.stickerGreen }]}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax</Text>
                  <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.grandLabel}>Total</Text>
                  <Text style={styles.grandValue}>${grandTotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 'shipping' && (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setStep('payment')}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>CONTINUE TO PAYMENT</Text>
            </TouchableOpacity>
          )}
          {step === 'payment' && (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setStep('review')}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>REVIEW ORDER</Text>
            </TouchableOpacity>
          )}
          {step === 'review' && (
            <TouchableOpacity
              style={[styles.nextBtn, processing && styles.processingBtn]}
              onPress={handlePlaceOrder}
              activeOpacity={0.8}
              disabled={processing}
            >
              <Text style={styles.nextBtnText}>
                {processing ? 'PROCESSING...' : `PLACE ORDER · $${buttonTotal.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  stepIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.m,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.stickerGreen,
    borderRadius: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.m,
    marginTop: Spacing.s,
  },
  formGroup: {
    marginBottom: Spacing.m,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.priceGray,
    marginBottom: 6,
    fontFamily: Fonts.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
  },
  savedAddressBtn: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  savedAddressText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  reviewEmoji: {
    fontSize: 28,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontFamily: Fonts.display,
    fontSize: 14,
    color: Colors.inkBlack,
  },
  reviewQty: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  reviewPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  reviewSection: {
    marginTop: Spacing.l,
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  reviewSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: 6,
  },
  reviewDetail: {
    fontSize: 14,
    color: Colors.inkBlack,
    lineHeight: 22,
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
  footer: {
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: Colors.paperWhite,
  },
  nextBtn: {
    backgroundColor: Colors.inkBlack,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  processingBtn: {
    backgroundColor: Colors.gray,
  },
  nextBtnText: {
    color: Colors.stickerGreen,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
