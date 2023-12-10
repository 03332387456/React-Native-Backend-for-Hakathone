const express = require("express");
const route = express.Router();
const AuthController = require("../controllers/authcontrollers");
// const CourseController = require("../controllers/coursecontroller");

route.delete("/delAll", AuthController.delAllUsers);
route.get("/CheckAuth", AuthController.CheckAuth);
route.get("/", AuthController.getUsers);
route.post("/signup", AuthController.signUp);
route.post("/login", AuthController.login);

module.exports = route;