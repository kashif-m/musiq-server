
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const spotify = require('./config/keys').spotify

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// passport authorization
app.use(passport.initialize())
require('./config/passport')(passport)

// connection to database
mongoose.set('useFindAndModify', false)
const db = require('./config/keys.js').mongoURI
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to mongoDB.'))
  .catch(err => console.log(err))

// routes
app.post('/token', (req, res) => {

  const {code, grant_type, refresh_token} = req.body
  const auth = Buffer.from(`${spotify.clientID}:${spotify.clientSecret}`).toString('base64')
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${auth}`
  }
  console.log(grant_type, code, refresh_token)
  axios.post('https://accounts.spotify.com/api/token', null, {headers,
    params: {
      grant_type,
      refresh_token,
      code,
      redirect_uri: 'http://localhost:8080'
    }})
    .then(spotifyRes => {
      res.json(spotifyRes.data)
      console.log(spotifyRes.data)
    })
    .catch(err => res.json(err.response.data))
})

const userRoutes = require('./routes/user')
const userDataRoutes = require('./routes/user-data')
app.use('/user', userRoutes)
app.use('/user-data', userDataRoutes)

// host
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}.`))
