// import npm dependencies
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')

// Tell the bodyparser middleware to accept certain amount of data only
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.post('/api/QWERTY-SIA', (req, res, next) => {
  console.log('/api/QWERTY-SIA is called...')
  console.log(req.body); next()},
  (req, res) => res.send(req.body))

// set to port 3000 for local testing
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening to port: ${port}...`))
