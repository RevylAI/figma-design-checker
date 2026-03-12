import React, { useState } from 'react';
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
import { allProducts, categories } from '../../constants/products';

export default function SpecimensScreen() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Beetles');

  const grouped = categories.slice(1).map(cat => ({
    name: cat,
    products: allProducts.filter(p => p.category === cat),
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Specimens</Text>
        <Text style={styles.subtitle}>COLLECTION CATALOG</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{allProducts.length}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {allProducts.filter(p => p.badge === 'RARE').length}
            </Text>
            <Text style={styles.statLabel}>RARE</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {allProducts.filter(p => p.badge === 'NEW').length}
            </Text>
            <Text style={styles.statLabel}>NEW</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{categories.length - 1}</Text>
            <Text style={styles.statLabel}>TYPES</Text>
          </View>
        </View>

        {grouped.map(group => (
          <View key={group.name} style={styles.categorySection}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() =>
                setExpandedCategory(prev => (prev === group.name ? null : group.name))
              }
              activeOpacity={0.7}
            >
              <Text style={styles.categoryTitle}>{group.name}</Text>
              <View style={styles.categoryMeta}>
                <Text style={styles.categoryCount}>{group.products.length}</Text>
                <Text style={styles.chevron}>
                  {expandedCategory === group.name ? '▾' : '▸'}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedCategory === group.name && (
              <View style={styles.categoryItems}>
                {group.products.map(product => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.specimenItem}
                    onPress={() => router.push(`/product/${product.id}`)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.specimenEmojiBox}>
                      <Text style={styles.specimenEmoji}>{product.emoji}</Text>
                    </View>
                    <View style={styles.specimenInfo}>
                      <Text style={styles.specimenName}>{product.name}</Text>
                      <Text style={styles.specimenDesc} numberOfLines={1}>
                        {product.description}
                      </Text>
                    </View>
                    <Text style={styles.specimenPrice}>${product.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
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
    paddingTop: Spacing.m,
    paddingBottom: Spacing.s,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.inkBlack,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.gray,
    letterSpacing: 1.5,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl,
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
    fontSize: 24,
    color: Colors.inkBlack,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.gray,
    letterSpacing: 1,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  categorySection: {
    marginBottom: Spacing.s,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    backgroundColor: Colors.lightGray,
  },
  categoryTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: Colors.inkBlack,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  chevron: {
    fontSize: 16,
    color: Colors.gray,
  },
  categoryItems: {
    backgroundColor: Colors.paperWhite,
  },
  specimenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  specimenEmojiBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specimenEmoji: {
    fontSize: 22,
  },
  specimenInfo: {
    flex: 1,
  },
  specimenName: {
    fontFamily: Fonts.display,
    fontSize: 14,
    color: Colors.inkBlack,
  },
  specimenDesc: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  specimenPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.priceGray,
  },
});
