const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  const [orders, productsCount, usersCount] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).limit(8),
    Product.countDocuments(),
    User.countDocuments(),
  ]);

  const allOrders = await Order.find({});
  const sales = allOrders.reduce((total, order) => total + order.totalPrice, 0);
  const pendingOrders = allOrders.filter((order) => order.status !== 'Delivered').length;

  const salesByStatus = allOrders.reduce((summary, order) => {
    summary[order.status] = (summary[order.status] || 0) + order.totalPrice;
    return summary;
  }, {});

  const monthlyRevenue = allOrders.reduce((summary, order) => {
    const month = new Date(order.createdAt).toLocaleString('en', { month: 'short' });
    summary[month] = (summary[month] || 0) + order.totalPrice;
    return summary;
  }, {});

  const orderAnalytics = allOrders.reduce((summary, order) => {
    const month = new Date(order.createdAt).toLocaleString('en', { month: 'short' });
    summary[month] = (summary[month] || 0) + 1;
    return summary;
  }, {});

  res.json({
    sales,
    ordersCount: allOrders.length,
    pendingOrders,
    productsCount,
    usersCount,
    recentOrders: orders,
    salesByStatus,
    monthlyRevenue,
    orderAnalytics,
  });
};

module.exports = { getDashboardStats };
