require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const client = require('./db/client');
const cors = require('cors');

client.connect();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const apiRouter = require('./api');
app.use('/api', apiRouter);

// Setup your Middleware and API Router here
app.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
    error: error.message,
  });
});

app.use(function (req, res, next) {
  res.status(404).send({
    message: 'Sorry cant find that!',
  });
});

module.exports = app;
