/** import des Modules */
const express = require('express');
const ctrlFormateur = require('../controllers/c_formateur')
const GuardAuth = require('../middleware/GuardAuth')

/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Formateur time: ', event.toString())
    next()
})

/** routage de formateur */
router.get('/', GuardAuth, ctrlFormateur.getAllFormateurs);
router.get('/:id', GuardAuth, ctrlFormateur.getFormateur);
router.put('/', GuardAuth, ctrlFormateur.addFormateur);



module.exports = router;