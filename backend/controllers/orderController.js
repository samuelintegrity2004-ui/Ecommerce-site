const Order = require('../models/Order');
const Product = require('../models/product');

const calculateItemsPrice = (items) =>
  items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);

const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const normalizedItems = orderItems.map((item) => ({
    product: item.product,
    name: item.name,
    image: item.image,
    price: Number(item.price),
    quantity: Number(item.quantity),
  }));
  const itemsPrice = calculateItemsPrice(normalizedItems);
  const shippingPrice = itemsPrice > 0 ? 0 : 0;

  const order = await Order.create({
    user: req.user._id,
    orderItems: normalizedItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Pay on delivery',
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  });

  await Promise.all(
    normalizedItems.map(async (item) => {
      const product = await Product.findById(item.product).catch(() => null);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    })
  );

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = req.body.status || order.status;
  order.deliveredAt = order.status === 'Delivered' ? new Date() : order.deliveredAt;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrderStatus };
