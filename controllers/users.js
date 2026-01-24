// bcrypt is for hashing passwords
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Method for viewing users.
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// Method for saving user in mongoDB.
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Encrypt/hash password in database.
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter