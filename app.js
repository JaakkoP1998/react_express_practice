require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const commentsRouter = require('./controllers/comments')

// File for main application.

// Webserver is created by using Express.
const app = express()

// Remove cors from use when using Render-version.
// Can be usefull in local testing.
const cors = require('cors')
app.use(cors())

// URL for connecting to Mongo-database
const url = process.env.MONGODB_URI

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())

app.use('/api/comments', commentsRouter)

module.exports = app