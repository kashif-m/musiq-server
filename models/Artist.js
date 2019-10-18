
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistSchema = {
  artist: {
    type: String,
    required: true
  }
}

module.exports = Artist = mongoose.model('artist', ArtistSchema)
