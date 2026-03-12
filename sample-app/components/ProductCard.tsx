import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../constants/theme';
import { Product } from '../constants/products';
import { useCart } from '../context/CartContext';
import HalftoneOverlay from './HalftoneOverlay';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToCart, updateQuantity, items } = useCart();
  const router = useRouter();

  const cartItem = items.find(i => i.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  const badgeStyle =
    product.badge === 'RARE'
      ? styles.badgeRare
      : product.badge === 'NEW'
      ? styles.badgeNew
      : product.badge === 'HOT'
      ? styles.badgeHot
      : null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imageContainer}>
        <HalftoneOverlay />
        {product.badge && badgeStyle && (
          <View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        <Text style={styles.bugVisual}>{product.emoji}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                addToCart(product);
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  updateQuantity(product.id, qty - 1);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyCount}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  addToCart(product);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: Spacing.s,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeRare: {
    backgroundColor: Colors.mangoOrange,
  },
  badgeNew: {
    backgroundColor: Colors.stickerGreen,
  },
  badgeHot: {
    backgroundColor: '#FF4444',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
  },
  bugVisual: {
    fontSize: 48,
    zIndex: 2,
  },
  productInfo: {
    flexDirection: 'column',
  },
  productName: {
    fontFamily: Fonts.display,
    fontSize: 15,
    lineHeight: 18,
    color: Colors.inkBlack,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.priceGray,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    lineHeight: 18,
    marginTop: -1,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inkBlack,
    borderRadius: 14,
    height: 28,
    gap: 2,
  },
  qtyBtn: {
    width: 26,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.stickerGreen,
    lineHeight: 17,
  },
  qtyCount: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.paperWhite,
    minWidth: 18,
    textAlign: 'center',
  },
});
