require('dotenv').config()
const express = require('express')
const Comment = require('./models/comment')

const app = express()
// Remove cors from use when using Render-version.
// Can be usefull in local testing.
//const cors = require('cors')

app.use(express.json())
//app.use(cors())
app.use(express.static('dist'))

// Webserver is created by using Express.
// Local main address for server is http://localhost:3001/
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// <baseUrl>/api/comments/ to see json-data.
app.get('/api/comments', (request, response) => {
  Comment.find({}).then(comments => {
    response.json(comments)
  })
})

// TODO: Does not work in current application, modify following to use MongoDB.
// Gets notes by their id.
/*
app.get('/api/comments/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  // Check if matching note was found, else return with status 404.
  if (note) {    
    response.json(note)  
  } else {    
    response.status(404).end()  
  }
})
*/

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
/* const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
 */

// This part is for running server in Render: https://render.com/
// Check to see that the server is working:
// https://react-express-practice.onrender.com/
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})