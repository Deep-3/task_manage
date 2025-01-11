// controllers/userController.js
const userService = require('../services/userservices');
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    // console.log(user);
    if(user=="A Super Admin already exists")
      return res.status(400).json({msg:'A Super Admin already exists'});
    if(user=="A user already exit")
      return res.status(400).json({msg:'A user already exit'});

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
