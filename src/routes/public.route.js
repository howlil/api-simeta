const express = require("express");
const publicRouter = express.Router();


publicRouter.get("/", (req, res) => {
    res.json({ message: "API is ready for you" });
});



module.exports = { publicRouter };