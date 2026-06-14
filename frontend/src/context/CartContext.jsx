import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemove } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], totalPrice: 0 });
  }, [user]);

  const addItem = async (productId, quantity = 1, product) => {
    const { data } = await apiAddToCart(productId, quantity, product);
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await apiRemove(productId);
    setCart(data);
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
