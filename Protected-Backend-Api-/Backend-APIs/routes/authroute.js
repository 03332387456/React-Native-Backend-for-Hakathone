const express = require("express");
const route = express.Router();
const AuthController = require("../controllers/authcontrollers")

route.post("/signup", AuthController.signUp);
route.post("/login", AuthController.login);

module.exports = route;