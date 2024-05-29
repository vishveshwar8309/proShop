const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// @desc     auth user & get token
// @route    POST   /api/users/login
// @access   public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.verifyPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }


});

// @desc     register user
// @route    POST   /api/users
// @access   public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const searchName = await User.findOne({ email });
  if (searchName) {
    res.status(409);
    throw new Error("email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid user data");
  }
});

// @desc     logout user
// @route    GET   /api/users/logout
// @access   private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "logout successful" });
});

// @desc     get user profile
// @route    GET   /api/users/profile
// @access   private
const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc     update profile
// @route    PUT   /api/users/profile
// @access   private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// // @desc     delete profile
// // @route    DELETE   /api/users/delete
// // @access   private
// const deleteProfile = asyncHandler(async (req, res) => {
//   res.send("delete user profile");
// });

// @desc     get all users
// @route    GET   /api/users
// @access   private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc     get user by id
// @route    GET   /api/users/:id
// @access   private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404)
    throw new Error('User not Found');
  }
});

// @desc     update user
// @route    PUT   /api/users/:id
// @access   private/admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user ");
});

// @desc     delete user
// @route    DELETE   /api/users/:id
// @access   private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error(`Admin can't be deleted`);
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ message: 'user deleted' })
  } else {
    res.status(404).json({ message: 'User not Found' });
  }
});

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  userProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
