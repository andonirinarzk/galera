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
router.get('', GuardAuth, ctrlEleve.getAllEleves);
router.get('/:id', GuardAuth, ctrlEleve.getEleve);
router.put('', GuardAuth, ctrlEleve.addEleve);



module.exports = router;