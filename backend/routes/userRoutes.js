const express = require('express');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
