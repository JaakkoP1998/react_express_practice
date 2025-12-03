const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Url containing my mongodb password is given through enviromental variables.
const url = process.env.MONGODB_URI

// Printing for debugging.
console.log('connecting to', url)

// Where actual connection is made.
mongoose.connect(url, { family: 4 })
  .then(result => {    
    console.log('connected to MongoDB')  
    })  
  .catch((error) => {    
    console.log('error connecting to MongoDB:', error.message)  
    })

// My schema for mongoDB-objects.
// Extremely simple at this point, maybe create more features in future.
const commentSchema = new mongoose.Schema({
  content: String,
})

// Transform given objects.
commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Comment', commentSchema)