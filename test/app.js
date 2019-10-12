const express = require('express')
const app = express()

app.post('/profile', (req, res) => res.json({ status: 'woo' }))

module.exports = app
