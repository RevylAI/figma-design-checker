import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import HeroBanner from '../../components/HeroBanner';
import FilterChips from '../../components/FilterChips';
import ProductGrid from '../../components/ProductGrid';
import { allProducts } from '../../constants/products';
import { Colors, Spacing } from '../../constants/theme';

export default function ShopScreen() {
  const [activeFilter, setActiveFilter] = useState('All Bugs');

  const filteredProducts =
    activeFilter === 'All Bugs'
      ? allProducts
      : allProducts.filter(p => p.category === activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroBanner />
        <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <ProductGrid products={filteredProducts} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paperWhite,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
});
