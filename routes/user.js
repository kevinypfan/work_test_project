const express = require("express");

const UserController = require("../controller/userController");

const router = express.Router();
const userController = new UserController();

router.post("/user/register", userController.register);

module.exports = router;
