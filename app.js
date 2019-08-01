// import npm dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// import routes
const rurl = require('./server/routes/api/replace-url');
const inventory_routes = require('./server/routes/api/inventory_data');

// Tell the bodyparser middleware to accept certain amount of data only
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cors());

// endpoint starts here
app.use('/QWERTY-SIA/api',inventory_routes);

app.post('/QWERTY-SIA/api', (req, res, next) => {
  console.log('/QWERTY-SIA/api is called...')
  console.log('req.body:\n', req.body)
  console.log('action: ', req.body.queryResult.action)
  next()},
  rurl.replaceURL,
  (req, res) => {
    console.log(req.body.queryResult)
    res.send(req.body.queryResult)})

const port = process.env.PORT || 5000;

app.listen(port,()=> console.log(`Server started on port ${port}`));
