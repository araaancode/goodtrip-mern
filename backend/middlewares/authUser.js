const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.cookies.jwt

  if (authHeader) {
    try {
      // extract token from authHeader string
      token = authHeader;

      // verified token returns user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user's obj in db and assign to req.user
      let user = await User.findById(decoded.id).select("-password");
      if (user && user.role === "user") {
        req.user = user;
        next();
      } else {
        res.send("you not allowed to do this !!!");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }
});

module.exports = protect;
