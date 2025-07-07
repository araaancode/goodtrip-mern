const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Owner = require('../models/Owner')

const authOwner = asyncHandler(async (req, res, next) => {
  let token
  const authHeader = req.headers.authorization


  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // extract token from authHeader string
      token = authHeader.split(' ')[1]

      // verified token returns owner id
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // find owner's obj in db and assign to req.Owner
      let owner = await Owner.findById(decoded.id).select('-password')
      if (owner && owner.role === "owner") {
        req.owner = owner
        next()
      }else{
        res.send("you not allowed to do this !!!")
      }

    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, invalid token')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token found')
  }
})



module.exports = authOwner