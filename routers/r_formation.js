/** import des Modules */
const express = require('express');
const ctrlFormation = require('../controllers/c_formation')
const GuardAuth = require('../middleware/GuardAuth');


/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Formation time: ', event.toString())
    next()
})

/** routage de formation */
router.get('', ctrlFormation.getAllFormations);
router.get('/:id', ctrlFormation.getFormation);
router.put('', ctrlFormation.addFormation);
router.post('/', GuardAuth, ctrlFormation.createFormation);


module.exports = router;