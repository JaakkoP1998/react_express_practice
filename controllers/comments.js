const commentsRouter = require('express').Router()
const { request } = require('express')
const Comment = require('../models/comment')
// Every comment needs reference to user that posted the comment.
const User = require('../models/user')
// Library for login tokens.
const jwt = require('jsonwebtoken')

// Controller-file for handling routes for comments.

// Helper function for getting the token from send request.
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Method for getting all the comments in json-object.
commentsRouter.get('/', (request, response) => {
  Comment.find({}).then(comments => {
    response.json(comments)
  })
})

// Method for getting comments by their id.
// Sends error 404 if matching id has not been found.
// Sends 400 error if id was given in wrong form (not matching MongoDBs id's).
commentsRouter.get('/:id', (request, response) =>{
Comment.findById(request.params.id)
  .then(comment => {
    if (comment) {        
      response.json(comment)      
      } else {        
        response.status(404).end()      
      }    
    })
  .catch(error => {      
    console.log(error)      
    response.status(400).send({ error: 'malformatted id' }) 
    })
})

// Method for adding new comments.
commentsRouter.post('/', async (request, response) => {  
  const body = request.body

  // Decode given token and send error if corresponding user is not found.
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // Reference to matching user.
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  // Send error if comment is empty.
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  // Constructor for Comment-object.
  const comment = new Comment({
    content: body.content,
    user: user._id
  })
  
  // Save comment to Mongo and add reference to user, who posted the comment
  const savedComment = await comment.save()
  user.comments = user.comments.concat(savedComment._id)
  await user.save()

  // Send 201 success when comment is saved.
  response.status(201).json(savedComment)
})

// Method to delete comments.
commentsRouter.delete('/:id', (request, response, next) => {
  Comment.findByIdAndDelete(request.params.id)
    .then(() => {
      console.log('Comment deleted succesfully.')
      response.status(204).end()
    })
    .catch(error => {
      console.error(error)
      response.status(500).json({ error: 'failed to delete the comment' })
    })
})

module.exports = commentsRouter