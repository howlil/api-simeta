const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const { publicRouter } = require("./src/routes/public.route.js");
const {router} = require("./src/routes/private.route.js")
require('dotenv').config()
const multer = require("multer")
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

app.use('/files', express.static(path.join(__dirname, 'public/files')));


app.use(publicRouter)
app.use(router)

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: true,
      messages: `File upload error: ${err.message}`,
    });
  }
  if (err.message === "Only PDF files are allowed!") {
    return res.status(400).json({
      error: true,
      messages: err.message,
    });
  }
  next(err);
});

module.exports = app;
