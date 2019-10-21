const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router'); 
const mongoose = require('mongoose');
const cors = require("cors")
mongoose.connect('mongodb://iocluster:mLab1234@ds237588.mlab.com:37588/pass');

app.use(morgan('common'));
// app.use(bodyParser.json({type: '*/*'}));
const busboyBodyParser = require('busboy-body-parser');
app.use(busboyBodyParser());
app.use(cors());

router(app);

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log('Server is listenening on :',port);