/** import des Modules */
const express = require('express');
const ctrlEleve = require('../controllers/c_eleve')
const limiter = require("../middleware/GuardLimiter");
const GuardPasswordValidator = require("../middleware/GuardPasswordValidator");

/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Eleve time: ', event.toString())
    next()
})

/** routage de eleve */
router.get('', ctrlEleve.getAllEleves);
router.get('/:id', ctrlEleve.getEleve);
router.put('', ctrlEleve.addEleve);
router.put('', GuardPasswordValidator, ctrlEleve.signup);
router.put('', limiter, ctrlEleve.login);


module.exports = router;