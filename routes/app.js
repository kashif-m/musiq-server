
const axios = require('axios')
const express = require('express')

const router = express.Router()

const spotify = require('../config/keys').spotify

router.post('/token', (req, res) => {

	const {code, grant_type, refresh_token, redirect_uri} = req.body
	const auth = Buffer.from(`${spotify.clientID}:${spotify.clientSecret}`).toString('base64')
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `Basic ${auth}`
	}
	axios.post('https://accounts.spotify.com/api/token', null, {headers,
		params: {
			grant_type,
			refresh_token,
			code,
			redirect_uri
		}})
		.then(spotifyRes => {
			res.json(spotifyRes.data)
		})
		.catch(err => res.json(err.response.data))
})

module.exports = router
