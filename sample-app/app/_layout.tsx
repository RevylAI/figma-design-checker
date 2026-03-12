import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Fraunces_900Black } from '@expo-google-fonts/fraunces/900Black';
import { CartProvider } from '../context/CartContext';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.stickerGreen} />
      </View>
    );
  }

  return (
    <CartProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.paperWhite },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="cart/index"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="checkout/index"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="checkout/confirmation"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="order/[id]"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.paperWhite,
  },
});
