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
import { allProducts } from '../../constants/products';
import { useCart } from '../../context/CartContext';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();

  const product = allProducts.find(p => p.id === Number(id));

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🔍</Text>
          <Text style={styles.notFoundText}>Specimen not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerCategory}>{product.category.toUpperCase()}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageBox}>
          {product.badge && (
            <View
              style={[
                styles.badge,
                product.badge === 'RARE'
                  ? styles.badgeRare
                  : product.badge === 'NEW'
                  ? styles.badgeNew
                  : styles.badgeHot,
              ]}
            >
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          <Text style={styles.productEmoji}>{product.emoji}</Text>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          <Text style={styles.productDesc}>{product.description}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>SPECIMEN DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{product.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rarity</Text>
            <Text style={styles.detailValue}>{product.badge || 'Standard'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Condition</Text>
            <Text style={styles.detailValue}>Preserved</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Origin</Text>
            <Text style={styles.detailValue}>Lab Bred</Text>
          </View>
        </View>

        {/* Related */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>RELATED SPECIMENS</Text>
            {related.map(r => (
              <TouchableOpacity
                key={r.id}
                style={styles.relatedItem}
                onPress={() => router.push(`/product/${r.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.relatedImageBox}>
                  <Text style={styles.relatedEmoji}>{r.emoji}</Text>
                </View>
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedName}>{r.name}</Text>
                  <Text style={styles.relatedPrice}>${r.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Price</Text>
          <Text style={styles.footerPriceValue}>${product.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => {
            addToCart(product);
            router.push('/cart');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
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
  headerCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageBox: {
    height: 240,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    marginHorizontal: Spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    zIndex: 2,
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
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
  },
  productEmoji: {
    fontSize: 80,
  },
  infoSection: {
    padding: Spacing.m,
    paddingTop: Spacing.l,
  },
  productName: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.inkBlack,
    lineHeight: 30,
  },
  productPrice: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.priceGray,
    marginTop: 4,
  },
  productDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.priceGray,
    fontFamily: Fonts.body,
    marginTop: Spacing.m,
  },
  detailsSection: {
    padding: Spacing.m,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.gray,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  relatedSection: {
    padding: Spacing.m,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  relatedImageBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedEmoji: {
    fontSize: 24,
  },
  relatedInfo: {
    flex: 1,
  },
  relatedName: {
    fontFamily: Fonts.display,
    fontSize: 15,
    color: Colors.inkBlack,
  },
  relatedPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.priceGray,
    marginTop: 2,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: Colors.paperWhite,
    gap: 16,
  },
  footerPrice: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 11,
    color: Colors.gray,
    fontFamily: Fonts.body,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerPriceValue: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.inkBlack,
  },
  addToCartBtn: {
    flex: 2,
    backgroundColor: Colors.inkBlack,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.stickerGreen,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.body,
  },
});
