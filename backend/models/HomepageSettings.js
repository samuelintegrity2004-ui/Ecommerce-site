const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['todaysDeal', 'newArrival', 'latestModel', 'hot', 'trending'],
      required: true,
    },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    limit: { type: Number, default: 8, min: 1, max: 24 },
  },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    bannerImage: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    buttonText: { type: String, default: 'Shop Now' },
    destinationLink: { type: String, default: '/products' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const homepageSettingsSchema = new mongoose.Schema(
  {
    heroSlides: { type: [heroSlideSchema], default: [] },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomepageSettings', homepageSettingsSchema);
