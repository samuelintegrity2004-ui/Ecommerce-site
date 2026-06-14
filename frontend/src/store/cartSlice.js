import { createSlice } from '@reduxjs/toolkit';

const CART_KEY = 'guestCart';

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : { items: [], totalPrice: 0 };
  } catch {
    return { items: [], totalPrice: 0 };
  }
};

const calculateTotal = (items) =>
  items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);

const persistCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getStoredCart(),
  reducers: {
    addItemToCart(state, action) {
      const { productId, quantity, product } = action.payload;
      const productKey = String(productId);
      const existingItem = state.items.find((item) => item.product === productKey);

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        state.items.push({
          product: productKey,
          name: product.name,
          image: product.image,
          price: Number(product.price),
          quantity: Number(quantity),
        });
      }

      state.totalPrice = calculateTotal(state.items);
      persistCart(state);
    },
    updateCartItem(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((cartItem) => cartItem.product === String(productId));

      if (item) {
        item.quantity = Math.max(1, Number(quantity));
        state.totalPrice = calculateTotal(state.items);
        persistCart(state);
      }
    },
    removeItemFromCart(state, action) {
      state.items = state.items.filter((item) => item.product !== String(action.payload));
      state.totalPrice = calculateTotal(state.items);
      persistCart(state);
    },
    clearLocalCart(state) {
      state.items = [];
      state.totalPrice = 0;
      persistCart(state);
    },
  },
});

export const { addItemToCart, updateCartItem, removeItemFromCart, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
