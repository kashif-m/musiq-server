
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// connection to database
mongoose.set('useFindAndModify', false)
const db = require('./config/keys.js').mongoURI
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to mongoDB.'))
  .catch(err => console.log(err))

// routes
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)

// host
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}.`))
