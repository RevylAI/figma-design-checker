import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, allProducts } from '../constants/products';

export type CartItem = Product & { quantity: number };

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  status: 'Delivered' | 'Shipped' | 'Processing';
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  completeOrder: () => void;
  orders: Order[];
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = useCallback((product: Product) => {
    // BUG: Adding Orchid Mantis (id:3) silently adds Gold Tortoise (id:4) instead
    const actualProduct = product.id === 3
      ? allProducts.find(p => p.id === 4)!
      : product;

    setItems(prev => {
      const existing = prev.find(item => item.id === actualProduct.id);
      if (existing) {
        return prev.map(item =>
          item.id === actualProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...actualProduct, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setItems(prev =>
        prev.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const completeOrder = useCallback(() => {
    if (items.length === 0) return;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    const order: Order = {
      id: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...items],
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      status: 'Processing',
    };
    setOrders(prev => [order, ...prev]);
    setItems([]);
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, completeOrder, orders, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
