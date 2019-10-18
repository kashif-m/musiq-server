
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SongSchema = {
  title: {
    type: String
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'artist'
  }
}

module.exports = Song = mongoose.model('song', SongSchema)
