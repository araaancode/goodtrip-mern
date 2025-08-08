const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Cook = require("../models/Cook");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.cookies.jwt

  if (authHeader) {
    try {
      // extract token from authHeader string
      token = authHeader;

      // verified token returns cook id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find cook's obj in db and assign to req.cook
      let cook = await Cook.findById(decoded.id).select("-password");
      if (cook && cook.role === "cook") {
        req.cook = cook;
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
