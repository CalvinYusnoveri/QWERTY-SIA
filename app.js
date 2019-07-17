// import npm dependencies
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.post('/api/QWERTY-SIA', (req, res, next) => {
  console.log('/api/QWERTY-SIA is called...'); next()},
  console.log(req.body)
  (req, res) => res.send(req.body))

// set to port 3000 for local testing
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening to port: ${port}...`))
