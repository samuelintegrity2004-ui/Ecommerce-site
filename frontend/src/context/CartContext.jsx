import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  clearLocalCart,
  removeItemFromCart,
  updateCartItem,
} from '../store/cartSlice';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addItem = async (productId, quantity = 1, product) => {
    dispatch(addItemToCart({ productId, quantity, product }));
  };

  const updateItem = (productId, quantity) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const removeItem = async (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const clearCart = () => {
    dispatch(clearLocalCart());
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
