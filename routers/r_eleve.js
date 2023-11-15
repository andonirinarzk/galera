/** import des Modules */
const express = require('express');
const ctrlEleve = require('../controllers/c_eleve')
const GuardAuth = require('../middleware/GuardAuth')


/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Eleve time: ', event.toString())
    next()
})

/** routage de eleve */
router.get('', GuardAuth(['administrateur', 'formateur']), ctrlEleve.getAllEleves);
router.get('/:id', GuardAuth(['administrateur', 'eleve', 'formateur']), ctrlEleve.getEleve);
router.put('', GuardAuth(['administrateur']), ctrlEleve.addEleve);



module.exports = router;