const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.isAdmin = typeof req.body.isAdmin === 'boolean' ? req.body.isAdmin : user.isAdmin;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'User removed' });
};

module.exports = { getUsers, updateUser, deleteUser };
