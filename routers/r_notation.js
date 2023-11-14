/** import des Modules */
const express = require('express');
const ctrlNotation = require('../controllers/c_notation')
const GuardAuth = require('../middleware/GuardAuth')


/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Notation time: ', event.toString())
    next()
})

/** routage de notation */
router.get('', GuardAuth, ctrlNotation.getAllNotations);
router.get('/:id', GuardAuth, ctrlNotation.getNotation);
router.put('', GuardAuth, ctrlNotation.addNotation);


module.exports = router;