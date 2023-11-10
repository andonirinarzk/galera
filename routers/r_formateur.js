/** import des Modules */
const express = require('express');
const ctrlFormateur = require('../controllers/c_formateur')


/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Formateur time: ', event.toString())
    next()
})

/** routage de formateur */
router.get('', ctrlFormateur.getAllFormateurs);
router.get('/:id', ctrlFormateur.getFormateur);
router.put('', ctrlFormateur.addFormateur);
router.post('', ctrlFormateur.signup);
router.post('', ctrlFormateur.login);

module.exports = router;