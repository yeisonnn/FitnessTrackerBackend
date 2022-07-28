require('dotenv').config();
const express = require('express');
const app = express();

const apiRouter = require('./api');
app.use('/api', apiRouter);

const cors = require('cors');
app.use(cors());

const morgan = require("morgan");
app.use(morgan("dev"));

const client = require("./db/client");
client.connect();

app.use(express.json());


// Setup your Middleware and API Router here
app.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message,
      error: error.message
    });
  });


module.exports = app;
