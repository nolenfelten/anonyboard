const express = require('express')
const bodyParser = require('body-parser')

const threadRoutes = require('./routes/threadRoutes')

const { mongoose } = require('db/mongoose')

const app = express()

// middleware
app.use(bodyParser.json())

// routes
app.use('/api/threads', threadRoutes)

// production server
if (process.env.NODE_ENV === 'production') {
  // serve production assets
  app.use(express.static('client/buid'))

  // serve index.html if unrecognized route
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.status(200).send('Server is up and running!')
  })
}

module.exports = app
