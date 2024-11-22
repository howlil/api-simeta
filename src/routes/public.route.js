const express = require("express");
const publicRouter = express.Router();
const {login} = require('../controllers/auth.controller.js')

publicRouter.get("/", (req, res) => {
    res.json({ message: "API is ready for you" });
});

publicRouter.post('/api/v1/login',login)


module.exports = { publicRouter };