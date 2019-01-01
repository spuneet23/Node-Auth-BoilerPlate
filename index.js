const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router'); 
const mongoose = require('mongoose');
const cors = require("cors")
mongoose.connect('mongodb://puneet:augmented123@ds145694.mlab.com:45694/arcards');

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