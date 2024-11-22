const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const { publicRouter } = require("./src/routes/public.route.js");

const app = express();


const corsOptions = {
  credentials: true,
  origin: "*",
};

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(publicRouter)

module.exports = app;
