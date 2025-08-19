const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Driver = require("../models/Driver");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.cookies.jwt

  if (authHeader) {
    try {
      // extract token from authHeader string
      token = authHeader;

      // verified token returns driver id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find driver's obj in db and assign to req.Driver
      let driver = await Driver.findById(decoded.id).select("-password");
      if (driver && driver.role === "driver") {
        req.driver = driver;
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
