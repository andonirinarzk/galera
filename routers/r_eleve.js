/** import des Modules */
const express = require('express');
const ctrlEleve = require('../controllers/c_eleve')


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


module.exports = router;