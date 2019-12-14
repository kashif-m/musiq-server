
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const SECRET_KEY = require('../config/keys').SECRET_KEY
const User = require('../models/User')
const UserData = require('../models/UserData')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('user.')
})

router.post('/new', (req, res) => {

  const {user} = req.body
  const {password, username, email} = user

  if(!validator.isEmail(email))
    return res.json({err: 'Enter valid e-mail.'})

  User.findOne({email})
    .then(user => {
      if(user)
        return res.json({err: 'User already exists.'})

      else
        User.findOne({username})
          .then(user => {
            if(user)
              return res.json({err: 'Username taken.'})
            else
              return bcrypt.genSalt(10)
          })
          .then(salt => {      
            return bcrypt.hash(password, salt)
          })
          .then(hash => {

            new User({
              username,
              password: hash,
              email
            })
            .save()
            .then(user => {
              new UserData({ user: user._id })
                .save()
                .then(account => console.log(account))
                .catch(err => console.log(err))
              res.json({
                id: user._id,
                username
              })
            })
            .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
          })
    .catch(err => console.log(err))
})

router.post('/login', (req, res) => {

  const {user} = req.body
  const {username, password} = user

  User.findOne({username})
    .then(user => {
      if(!user)
        return res.json({err: 'Please check your credentials.'})

      bcrypt.compare(password, user.password)
        .then(matched => {
          if(!matched)
            return res.json({err: 'Please check your credentials.'})

          const payload = {
            user: user._id,
            username
          }

          jwt.sign(payload, SECRET_KEY, (err, token) => {
            if(err)
              return console.log(err)

            res.json({
              id: user._id,
              username,
              token: 'Bearer ' + token
            })
          })
        })
    })
})

module.exports = router
