const express = require("express");
const CourseController = require("../controllers/coursecontroller");
const AuthController = require("../controllers/authcontrollers");
const route = express.Router();

route.get("/", AuthController.protected, CourseController.get);
route.get("/:id", CourseController.getById);
route.post("/", CourseController.add);
route.delete("/:id", CourseController.del);
route.delete("/", CourseController.delAll);
route.put("/:id", CourseController.edit)


module.exports = route;