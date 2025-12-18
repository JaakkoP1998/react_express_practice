require('dotenv').config()
const express = require('express')
const Comment = require('./models/comment')

const app = express()
// Remove cors from use when using Render-version.
// Can be usefull in local testing.
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Webserver is created by using Express.
// Local main address for server is http://localhost:3001/
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Method for getting all the comments in json-object.
app.get('/api/comments', (request, response) => {
  Comment.find({}).then(comments => {
    response.json(comments)
  })
})

// Method for getting comments by their id.
// Sends error 404 if matching id has not been found.
// Sends 400 error if id was given in wrong form (not matching MongoDBs id's).
app.get('/api/comments/:id', (request, response) => {
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
app.post('/api/comments', (request, response) => {  
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
      response.status(500).json({ error: 'failed to save comment' })
    })
})

// This part is for running server locally
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// This part is for running server in Render: https://render.com/
// Check to see that the server is working:
// https://react-express-practice.onrender.com/
/* const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) */