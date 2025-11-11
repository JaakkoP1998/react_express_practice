// Temporary code for testing mongo database.
const mongoose = require('mongoose')

// Password is given from command promt.
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// URL for connecting my cluster.
const url = `mongodb+srv://jaakkop1998_db_user:${password}@cluster0.4rgkdh5.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

// MongoDB schema.
const commentSchema = new mongoose.Schema({
  content: String,
})

const Comment = mongoose.model('Comment', commentSchema)

const comment = new Comment({
  content: 'This is for testing Mongo atlas Database.',
})

// Save comment and close connection.
comment.save().then(result => {
  console.log('comment saved!')
  mongoose.connection.close()
})