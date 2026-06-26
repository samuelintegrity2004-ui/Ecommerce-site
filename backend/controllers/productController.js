const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const getProductImages = async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '../images');
    const files = fs.readdirSync(imagesDir).filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    
    const products = files.map((file) => {
      const fileName = file.replace(/\.(jpg|jpeg|png|gif)$/i, '');
      const category = getCategoryFromFileName(fileName);
      const sequence = getSequenceFromFileName(fileName);
      
      return {
        _id: file,
        name: generateProductName(category, sequence, fileName),
        image: `/images/${file}`,
        price: generateRandomPrice(),
        category: category,
        fileName: file,
      };
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product images', error: error.message });
  }
};

const getCategoryFromFileName = (fileName) => {
  return fileName
    .toLowerCase()
    .replace(/_\d+$/, '')
    .replace(/-\d+$/, '');
};

const getSequenceFromFileName = (fileName) => {
  const match = fileName.match(/[-_](\d+)$/);
  return match ? Number(match[1]) : 1;
};

const generateProductName = (category, sequence, fileName) => {
  const nameMap = {
    'bike': ['Mountain Bike', 'Electric Bike', 'High-Speed Racing Bike', 'Premium Road Bike', 'Hybrid Bike', 'BMX Bike', 'Cruiser Bike'],
    'car': ['Luxury Sedan', 'Sports Car', 'SUV', 'Compact Car', 'Electric Vehicle', 'Hybrid Car', 'Off-Road Vehicle', 'Convertible', 'Truck', 'Mini Van', 'Hatchback', 'Station Wagon', 'Coupe', 'Pickup Truck', 'Crossover'],
    'cloth': ['Premium Cotton T-Shirt', 'Designer Jeans', 'Casual Polo Shirt', 'Elegant Dress', 'Sports Jacket', 'Business Blazer', 'Summer Shorts', 'Wool Sweater', 'Linen Shirt'],
    'watch': ['Digital Smartwatch', 'Analog Chronograph', 'Luxury Timepiece', 'Sport Watch', 'Dive Watch', 'Pilot Watch', 'Dress Watch', 'Fitness Tracker Watch'],
    'phone-accessories': ['Phone Case', 'Screen Protector', 'Charging Cable', 'Wireless Charger', 'Pop Socket', 'Phone Stand', 'USB Hub', 'Phone Ring Holder'],
    'fan': ['Desk Standing Fan', 'Pedestal Fan', 'Box Fan', 'Tower Fan', 'Oscillating Fan', 'USB Mini Fan', 'Ceiling Fan'],
    'bulb': ['LED Light Bulb', 'Smart Bulb', 'Energy Saving Bulb', 'Dimmable Bulb', 'Color Changing Bulb', 'Warm White Bulb'],
    'electric-cook': ['Electric Cooker', 'Rice Cooker', 'Pressure Cooker', 'Induction Cooktop', 'Electric Griddle', 'Hot Plate', 'Electric Kettle'],
    'fridge': ['Side-by-Side Refrigerator', 'French Door Fridge', 'Top-Freezer Refrigerator', 'Bottom-Freezer Fridge', 'Counter-Depth Fridge', 'Mini Fridge'],
    'tv': ['Smart LED TV', '4K Television', 'OLED TV', 'Curved TV', 'Ultra HD Display', 'HD Ready TV', 'Full HD Television'],
    'laptop': ['Gaming Laptop', 'Business Laptop', 'Ultrabook', 'MacBook Pro', 'Budget Laptop', 'Touchscreen Laptop', 'Portable Laptop'],
    'camera': ['Digital Camera', 'Mirrorless Camera', 'DSLR Camera', 'Action Camera', '360 Camera'],
    'hd': ['Wireless Headphones', 'Noise Cancelling Headphones', 'Studio Headphones', 'Gaming Headset', 'Over-Ear Headphones', 'In-Ear Earbuds'],
    'iron': ['Steam Iron', 'Dry Iron', 'Cordless Iron', 'Professional Iron', 'Travel Iron'],
    'stanley-cup': ['Stanley Tumbler', 'Insulated Cup', 'Travel Mug', 'Coffee Thermos', 'Water Bottle'],
  };

  const names = nameMap[category];
  if (names) {
    const baseName = names[(sequence - 1) % names.length];
    const round = Math.floor((sequence - 1) / names.length);
    return round > 0 ? `${baseName} ${round + 1}` : baseName;
  }

  return fileName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const generateRandomPrice = () => {
  return Math.floor(Math.random() * (500000 - 5000 + 1)) + 5000; // ₦5,000 to ₦500,000
};

const parseSections = (sections) => {
  if (Array.isArray(sections)) return sections;
  if (!sections) return [];
  try {
    const parsed = JSON.parse(sections);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(sections).split(',').map((section) => section.trim()).filter(Boolean);
  }
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
};

const normalizeProductData = (body, file) => {
  const { imagePublicId, ...bodyData } = body;
  const productData = {
    ...bodyData,
    price: bodyData.price !== undefined ? Number(bodyData.price) : bodyData.price,
    stock: bodyData.stock !== undefined ? Number(bodyData.stock) : bodyData.stock,
    isFeatured: bodyData.isFeatured === true || bodyData.isFeatured === 'true',
    sections: parseSections(bodyData.sections),
  };

  if (file) {
    productData.image = file.path;
    productData.imagePublicId = file.filename;
  } else if (bodyData.image) {
    productData.image = bodyData.image;
  }

  return productData;
};

const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const section = req.query.section && req.query.section !== 'all' ? { sections: req.query.section } : {};
  const newest = req.query.section === 'newArrival';
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 0;
  const skip = limit ? (page - 1) * limit : 0;
  const sort = newest || req.query.sort === 'newest' ? { createdAt: -1 } : { createdAt: -1 };
  const query = { ...keyword, ...category, ...section };
  const productsQuery = Product.find(query).sort(sort);
  if (limit) productsQuery.skip(skip).limit(limit);
  const [products, total] = await Promise.all([productsQuery, Product.countDocuments(query)]);
  if (limit) {
    res.json({ products, total, page, pages: Math.ceil(total / limit) || 1 });
    return;
  }
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(10);
  res.json(products);
};

const createProduct = async (req, res) => {
  const productData = normalizeProductData(req.body, req.file);
  const product = await Product.create(productData);
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    await deleteCloudinaryImage(req.file?.filename);
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const productData = normalizeProductData(req.body, req.file);
  const imageWasReplaced = productData.image && productData.image !== existingProduct.image;
  if (!req.file && imageWasReplaced) {
    productData.imagePublicId = '';
  }

  const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });

  if (imageWasReplaced && existingProduct.imagePublicId && existingProduct.imagePublicId !== req.file?.filename) {
    await deleteCloudinaryImage(existingProduct.imagePublicId);
  }

  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    await deleteCloudinaryImage(product.imagePublicId);
    res.json({ message: 'Product removed' });
  } else res.status(404).json({ message: 'Product not found' });
};

const bulkAssignSections = async (req, res) => {
  const { productIds = [], sections = [], mode = 'replace' } = req.body;
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: 'Select at least one product' });
  }

  const update = mode === 'add'
    ? { $addToSet: { sections: { $each: sections } } }
    : { $set: { sections } };

  await Product.updateMany({ _id: { $in: productIds } }, update);
  res.json({ message: 'Products updated' });
};

module.exports = {
  getProducts, getProductById, getFeaturedProducts,
  createProduct, updateProduct, deleteProduct, getProductImages, bulkAssignSections,
};
