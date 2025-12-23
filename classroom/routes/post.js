const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hi, this is post");
});

router.get("/:id", (req, res) => {
    res.send("Hi, this post in _id");
});

router.post("/", (req, res) => {
    res.send("Post for post post");
});

router.delete("/:id", (req, res) => {
    res.send("DELETE for post delete id");
});

module.exports = router;