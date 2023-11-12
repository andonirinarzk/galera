/** import des Modules */
const express = require('express');
const ctrlFormateur = require('../controllers/c_formateur')
const limiter = require("../middleware/GuardLimiter");
const GuardPasswordValidator = require("../middleware/GuardPasswordValidator");

/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Formateur time: ', event.toString())
    next()
})

/** routage de formateur */
router.get('/', ctrlFormateur.getAllFormateurs);
router.get('/:id', ctrlFormateur.getFormateur);
router.put('/', ctrlFormateur.addFormateur);
router.put('/', GuardPasswordValidator, ctrlFormateur.signup);
router.put('/', limiter, ctrlFormateur.login);



module.exports = router;