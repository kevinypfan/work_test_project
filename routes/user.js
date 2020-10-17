const express = require("express");

const UserController = require("../controllers/userController");

const router = express.Router();
const userController = new UserController();

router.post("/user/register", userController.register);

module.exports = router;
