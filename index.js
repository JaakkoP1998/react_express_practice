const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())

// Some json-notes for testing
let notes = [  
    {    
        id: "1",    
        content: "These are comments meant for testing web-application",    
    },  
    {    
        id: "2",    
        content: "Some features may not be yet applied",    
    },  
    {    
        id: "3",    
        content: "Works as a back-end for https://github.com/JaakkoP1998/react_harjoittelua",    
    }
]

// Webserver is created by using Express.
// Local main address for server is http://localhost:3001/
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// "http://localhost:3001/api/comments/" to see json-data.
app.get('/api/comments', (request, response) => {
  response.json(notes)
})

// Get note by id.
// For example "http://localhost:3001/api/notes/1" shows note matching id number 1. 
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

// Helper function to generate new id based on notes.length
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

// Method for adding new notes.
app.post('/api/comments', (request, response) => {  
    const body = request.body

    // Content-field is not allowed to be empty.
    if (!body.content) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }
    
    const note = {
        content: body.content,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

// This part is for running server locally
/*
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
*/

// This part is for running server in Render: https://render.com/
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})