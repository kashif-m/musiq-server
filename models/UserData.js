
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserDataSchema = {
  liked: {
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'song'
    }]
  },
  playlist: [{
    title: {
      type: String
    },
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'song'
    }]
  }]
}

module.exports = UserData = mongoose.model('user-data', UserDataSchema)
