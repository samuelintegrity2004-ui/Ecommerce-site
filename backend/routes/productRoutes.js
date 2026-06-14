const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, getFeaturedProducts,
  createProduct, updateProduct, deleteProduct, getProductImages
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/gallery/images', getProductImages);
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.single('imageFile'), createProduct);
router.put('/:id', protect, admin, upload.single('imageFile'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
