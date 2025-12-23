const express = require("express");
const router = express.Router();


router.get("/users", (req, res) => {
    res.send("Hi, this is user");
});

router.get("/users/:id", (req, res) => {
    res.send("Hi, this User in _id");
});

router.post("/users", (req, res) => {
    res.send("Post for user");
});

router.delete("/users/:id", (req, res) => {
    res.send("DELETE for user id");
});

module.exports = router;