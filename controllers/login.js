// Library for token-based login.
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Request for logging in with existing user.
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // Check that matching username is found
  // and compare that the passwords match.
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

 // If either username or password don't match, send error.
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // What the token contains.
  const userForToken = {
    username: user.username,
    id: user._id,
  }

// Create digital signature for the user (the token).
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter