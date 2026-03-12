import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Fonts } from '../constants/theme';
import { categories } from '../constants/products';

type Props = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

export default function FilterChips({ activeFilter, onFilterChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}
    >
      {categories.map(filter => (
        <TouchableOpacity
          key={filter}
          style={[styles.chip, activeFilter === filter && styles.chipActive]}
          onPress={() => onFilterChange(filter)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    gap: Spacing.s,
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.m,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Colors.inkBlack,
  },
  chipText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
  },
  chipTextActive: {
    color: Colors.paperWhite,
  },
});
