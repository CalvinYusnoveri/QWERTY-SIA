// import npm dependencies
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

// import modules
const replaceURL = require('./modules/replace-url')

const inventory_routes = require('./server/routes/api/inventory_data');


// Tell the bodyparser middleware to accept certain amount of data only
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cors());




app.use('/QWERTY-SIA/api',inventory_routes);



const port = process.env.PORT || 5000;


app.listen(port,()=> console.log(`Server started on port ${port}`));
