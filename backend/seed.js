const mongoose = require('mongoose');
const Product = require('./models/product');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding ✅');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany({}); // Clear existing products
    
    const products = [
      {
        name: 'Standing Fan',
        description: 'Powerful 12-inch standing fan with 3-speed control',
        price: 45.99,
        image: '/uploads/standing-fan.jpg',
        category: 'Home',
        brand: 'CoolBrew',
        stock: 50,
        rating: 4.2,
        numReviews: 128,
        isFeatured: true,
      },
      {
        name: 'Mountain Bike',
        description: '21-speed aluminum frame mountain bike, perfect for trails',
        price: 299.99,
        image: '/uploads/mountain-bike.jpg',
        category: 'Sports',
        brand: 'TrailMaster',
        stock: 30,
        rating: 4.7,
        numReviews: 86,
        isFeatured: true,
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        price: 199.99,
        image: '/uploads/smart-watch.jpg',
        category: 'Electronics',
        brand: 'TechPulse',
        stock: 40,
        rating: 4.5,
        numReviews: 342,
        isFeatured: true,
      },
      {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling Bluetooth headphones with 30-hour battery',
        price: 89.99,
        image: '/uploads/wireless-headphones.jpg',
        category: 'Electronics',
        brand: 'SoundWave',
        stock: 60,
        rating: 4.3,
        numReviews: 217,
        isFeatured: false,
      },
      {
        name: 'Smart TV 55"',
        description: '4K Ultra HD Smart TV with streaming apps built-in',
        price: 549.99,
        image: '/uploads/smart-tv.jpg',
        category: 'Electronics',
        brand: 'PixelMax',
        stock: 20,
        rating: 4.6,
        numReviews: 95,
        isFeatured: true,
      },
      {
        name: 'Laptop Pro',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 899.99,
        image: '/uploads/laptop-pro.jpg',
        category: 'Electronics',
        brand: 'CompuTech',
        stock: 15,
        rating: 4.8,
        numReviews: 411,
        isFeatured: true,
      },
      {
        name: 'LED Bulb Set',
        description: 'Set of 10 energy-efficient LED bulbs, 800 lumens',
        price: 24.99,
        image: '/uploads/led-bulbs.jpg',
        category: 'Home',
        brand: 'BrightLight',
        stock: 100,
        rating: 4.1,
        numReviews: 63,
        isFeatured: false,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof speaker with 360° sound',
        price: 69.99,
        image: '/uploads/bluetooth-speaker.jpg',
        category: 'Electronics',
        brand: 'SoundBurst',
        stock: 45,
        rating: 4.4,
        numReviews: 188,
        isFeatured: true,
      },
    ];

    await Product.insertMany(products);
    console.log('✅ Database seeded with', products.length, 'products');
    console.log('\n📝 NOTE: Please add images to backend/uploads/ folder:');
    products.forEach(p => {
      const imageName = p.image.split('/').pop();
      console.log(`   - ${imageName}`);
    });
    console.log('\n💡 You can download sample images from Unsplash or use placeholder images');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedProducts());
