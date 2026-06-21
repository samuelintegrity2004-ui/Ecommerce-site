const mongoose = require('mongoose');

const productSections = ['todaysDeal', 'newArrival', 'latestModel', 'hot', 'trending'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    sections: {
      type: [String],
      enum: productSections,
      default: [],
    },
  },
  { timestamps: true }
);

productSchema.statics.sections = productSections;

module.exports = mongoose.model('Product', productSchema);
