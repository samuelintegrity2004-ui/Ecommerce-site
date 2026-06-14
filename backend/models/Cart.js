const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
