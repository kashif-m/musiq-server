
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// passport authorization
app.use(passport.initialize())
require('./config/passport')(passport)

// connection to database
mongoose.set('useFindAndModify', false)
const db = require('./config/keys.js').mongoLocalURI
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to mongoDB.'))
  .catch(err => console.log(err))

// routes
const appRoutes = require('./routes/app')
const localRoutes = require('./routes/local-music')
const userRoutes = require('./routes/user')
const userDataRoutes = require('./routes/user-data')
app.use('/user', userRoutes)
app.use('/user-data', userDataRoutes)
app.use('/local', localRoutes)
app.use('/', appRoutes)

// serve front-end
app.get('/', (req, res) => {
  app.use(express.static('build'))
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

// host
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}.`))
