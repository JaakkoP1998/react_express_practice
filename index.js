const app = require('./app') // Main application for server.

// This part is for running server locally
const PORT = process.env.PORT
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