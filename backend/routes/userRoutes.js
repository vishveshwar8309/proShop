const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
  userProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, userProfile).put(protect, updateProfile);
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
