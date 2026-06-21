const express = require('express');
const {
  getHomepageSettings,
  updateHomepageSettings,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getHomepageContent,
} = require('../controllers/homepageController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/content', getHomepageContent);
router.get('/settings', protect, admin, getHomepageSettings);
router.put('/settings', protect, admin, updateHomepageSettings);
router.post('/hero-slides', protect, admin, upload.single('bannerFile'), addHeroSlide);
router.put('/hero-slides/:slideId', protect, admin, upload.single('bannerFile'), updateHeroSlide);
router.delete('/hero-slides/:slideId', protect, admin, deleteHeroSlide);

module.exports = router;
