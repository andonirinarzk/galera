/** import des Modules */
const express = require('express');
const ctrlNotation = require('../controllers/c_notation')


/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Notation time: ', event.toString())
    next()
})

/** routage de notation */
router.get('', ctrlNotation.getAllNotations);
router.get('/:id', ctrlNotation.getNotation);
router.put('', ctrlNotation.addNotation);


module.exports = router;