const asyncHandler = require("./asyncHandler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error("Unauthorized! User not found"));
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("unauthorised! invalid token");
    }
  } else {
    res.status(401);
    throw new Error("unauthorised! no token found");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorised as admin");
  }
});

module.exports = { protect, admin };
