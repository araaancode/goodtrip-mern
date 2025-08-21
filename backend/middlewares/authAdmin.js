const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.cookies.jwt

  if (authHeader) {
    try {
      // extract token from authHeader string
      token = authHeader;

      // verified token returns admin id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find admin's obj in db and assign to req.admin
      let admin = await Admin.findById(decoded.id).select("-password");
      if (admin && admin.role === "admin") {
        req.admin = admin;
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
