const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Owner = require("../models/Owner");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.cookies.jwt

  if (authHeader) {
    try {
      // extract token from authHeader string
      token = authHeader;

      // verified token returns owner id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find owner's obj in db and assign to req.owner
      let owner = await Owner.findById(decoded.id).select("-password");
      if (owner && owner.role === "owner") {
        req.owner = owner;
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
