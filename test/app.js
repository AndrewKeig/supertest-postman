const express = require('express')
const app = express()

app.post('/profile', (req, res) => res.status(201).json({ status: 'woo' }))

module.exports = app
