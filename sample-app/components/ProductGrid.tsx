import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Product } from '../constants/products';
import ProductCard from './ProductCard';
import { Spacing } from '../constants/theme';

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(products.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: Spacing.m,
    gap: Spacing.m,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
});
