const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json(cart || { items: [], totalPrice: 0 });
};

const addToCart = async (req, res) => {
  const { productId, quantity, product: productSnapshot } = req.body;
  let product = null;

  if (mongoose.Types.ObjectId.isValid(productId)) {
    product = await Product.findById(productId);
  }

  if (!product && productSnapshot?.name && productSnapshot?.image && productSnapshot?.price) {
    product = {
      name: productSnapshot.name,
      image: productSnapshot.image,
      price: Number(productSnapshot.price),
    };
  }

  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });

  const existingItem = cart.items.find((i) => i.product === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId, name: product.name,
      image: product.image, price: product.price, quantity,
    });
  }
  cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  await cart.save();
  res.json(cart);
};

const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  await cart.save();
  res.json(cart);
};

const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
