/* Import des modules necessaires */
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/c_user");

const limiter = require("../middleware/GuardLimiter");
const GuardPasswordValidator = require("../middleware/GuardPasswordValidator");

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Login/signup time: ', event.toString())
    next()
})

/* Routage User */
router.post("/signup", GuardPasswordValidator, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);


module.exports = router