
const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const spotify = require('./config/keys').spotify

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// connection to database
mongoose.set('useFindAndModify', false)
const db = require('./config/keys.js').mongoURI
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to mongoDB.'))
  .catch(err => console.log(err))

// routes
app.post('/token', (req, res) => {

  const {code} = req.body
  const auth = Buffer.from(`${spotify.clientID}:${spotify.clientSecret}`).toString('base64')
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${auth}`
  }
  const grant_type = 'authorization_code'
  axios.post('https://accounts.spotify.com/api/token', null, {headers,
    params: {
      grant_type,
      code,
      redirect_uri: 'http://localhost:8080'
    }})
    .then(spotifyRes => res.json(spotifyRes.data))
    .catch(err => res.json(err.response.data))
})
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)

// host
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}.`))
