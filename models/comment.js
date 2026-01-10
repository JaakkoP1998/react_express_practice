const mongoose = require('mongoose')

// My schema for mongoDB-objects.
const commentSchema = new mongoose.Schema({
  // Content is required for comment. 
  // TODO: Maybe add popup telling user if their comment is too short.
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  // Reference to user's id, who made the comment.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Transform Mongo-objects to Json.
commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Comment', commentSchema)