import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import { allProducts } from '../../constants/products';
import { useCart } from '../../context/CartContext';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { addToCart } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const trendingSearches = ['Beetle', 'Rare', 'Spider', 'Moth'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search bugs, beetles, moths..."
          placeholderTextColor={Colors.gray}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <Text style={styles.sectionTitle}>TRENDING SEARCHES</Text>
            <View style={styles.trendingRow}>
              {trendingSearches.map(term => (
                <TouchableOpacity
                  key={term}
                  style={styles.trendingChip}
                  onPress={() => setQuery(term)}
                >
                  <Text style={styles.trendingText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: Spacing.l }]}>POPULAR SPECIMENS</Text>
            {allProducts.slice(0, 4).map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.popularItem}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Text style={styles.popularEmoji}>{product.emoji}</Text>
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{product.name}</Text>
                  <Text style={styles.popularPrice}>${product.price.toFixed(2)}</Text>
                </View>
                {product.badge && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>{product.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : results.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsEmoji}>🔍</Text>
            <Text style={styles.noResultsTitle}>No specimens found</Text>
            <Text style={styles.noResultsText}>
              Try searching for beetles, moths, or spiders
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.resultCount}>
              {results.length} specimen{results.length !== 1 ? 's' : ''} found
            </Text>
            {results.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.resultItem}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <View style={styles.resultImageBox}>
                  <Text style={styles.resultEmoji}>{product.emoji}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{product.name}</Text>
                  <Text style={styles.resultCategory}>{product.category}</Text>
                  <Text style={styles.resultPrice}>${product.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.resultAddBtn}
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.resultAddBtnText}>+</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    marginHorizontal: Spacing.m,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
  },
  clearBtn: {
    fontSize: 16,
    color: Colors.gray,
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl,
  },
  emptyState: {},
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: Colors.gray,
    fontFamily: Fonts.body,
    marginBottom: Spacing.s,
  },
  trendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  trendingChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
  },
  trendingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inkBlack,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  popularEmoji: {
    fontSize: 32,
  },
  popularInfo: {
    flex: 1,
  },
  popularName: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.inkBlack,
  },
  popularPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.priceGray,
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: Colors.mangoOrange,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
  },
  noResults: {
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsEmoji: {
    fontSize: 48,
    marginBottom: Spacing.m,
  },
  noResultsTitle: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.inkBlack,
    marginBottom: Spacing.s,
  },
  noResultsText: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  resultCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.gray,
    fontFamily: Fonts.body,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.m,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  resultImageBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultEmoji: {
    fontSize: 28,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.inkBlack,
  },
  resultCategory: {
    fontSize: 11,
    color: Colors.gray,
    fontFamily: Fonts.body,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  resultPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.priceGray,
    marginTop: 2,
  },
  resultAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAddBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    lineHeight: 20,
  },
});
