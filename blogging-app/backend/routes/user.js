const express = require("express");
const { registerUser } = require("../controllers/user.controllers");
const app = express();

app.post("/register", registerUser);

module.exports = app;
