/* Import des modules necessaires */
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/c_user");
const limiter = require("../middleware/GuardLimiter");

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Login time: ', event.toString())
    next()
})

/* Routage enregistrement User */
router.post('/register', limiter, userCtrl.register);

/* Routage connexion User */
router.post('/login', limiter, userCtrl.login);


module.exports = router