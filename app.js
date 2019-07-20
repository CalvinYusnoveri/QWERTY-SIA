// import npm dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// import routes
const replaceURL = require('./server/routes/api/replace-url');

// Tell the bodyparser middleware to accept certain amount of data only
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cors());

// endpoint here
app.use('/api/QWERTY-SIA', async (req, res, next) => {
  console.log('/api/QWERTY-SIA is called...')
  console.log('req.body:\n', req.body)
  console.log('action: ', req.body.queryResult.action)
  next()},
  replaceURL,
  (req, res) => res.send(req.body))

const port = process.env.PORT || 5000;

app.listen(port,()=> console.log(`Server started on port ${port}`));
