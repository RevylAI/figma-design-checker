import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '../constants/theme';
import { useCart } from '../context/CartContext';

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <View style={styles.header}>
      <Text style={styles.brand}>BUG BAZAAR</Text>
      <TouchableOpacity
        style={styles.cartIcon}
        onPress={() => router.push('/cart')}
        activeOpacity={0.7}
      >
        <Ionicons name="bag-outline" size={16} color={Colors.inkBlack} />
        {totalItems > 0 && (
          <View style={styles.cartCount}>
            <Text style={styles.cartCountText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    backgroundColor: 'rgba(252, 252, 252, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  brand: {
    fontFamily: Fonts.display,
    fontSize: 20,
    letterSpacing: -0.5,
    color: Colors.inkBlack,
  },
  cartIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.stickerGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.mangoOrange,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.paperWhite,
  },
  cartCountText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
