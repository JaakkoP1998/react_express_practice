const commentsRouter = require('express').Router()
const { request } = require('express')
const Comment = require('../models/comment')

// Controller-file for handling routes for comments.

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

// Method for adding new notes.
commentsRouter.post('/', (request, response) => {  
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  // Constructor for Comment-object.
  const comment = new Comment({
    content: body.content,
  })
  
  // Save comment to Mongo.
  // Sends 500 error if failed to save.
  comment.save()
    .then(savedComment => {
      console.log('Comment saved!')
      response.status(201).json(savedComment)
    })
    .catch(error => {
      console.error(error)
      response.status(500).json({ error: 'failed to save the comment' })
    })
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