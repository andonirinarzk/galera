/** import des Modules */
const express = require('express');
const ctrlModule = require('../controllers/c_module')
const GuardAuth = require('../middleware/GuardAuth');


/** récupère le router d'express */
let router = express.Router();

/** Middleware time */
router.use((req, res, next) => {
    const event = new Date();
    console.log('Module time: ', event.toString())
    next()
})

/** routage de module */
router.get('', ctrlModule.getAllModules);
router.get('/:id', ctrlModule.getModule);
router.put('', GuardAuth(['administrateur']), ctrlModule.addModule);


module.exports = router;