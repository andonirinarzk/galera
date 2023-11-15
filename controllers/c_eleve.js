/** import des Modules */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ encoding: "latin1" });
const DB = require('../db.config');
const Eleve = DB.Eleve;

/** contenu */
exports.getAllEleves = (req, res) => {
    Eleve.findAll()
        .then(eleves => res.json({ data: eleves }))
        .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }))

}

exports.getEleve = async (req, res) => {
    let eleveId = parseInt(req.param.id);

    if (!eleveId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        let eleve = await Eleve.findOne({ where: { id: eleveId } })

        if (eleve === null) {
            return res.status(400).json({ message: `Cet eleve n'existe pas` })
        }

        return res.json({ data: eleve })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addEleve = async (req, res) => {
    const { nom, prenom, email, id_formation } = req.body;

    if (!nom || !prenom || !email || !id_formation) {
        return res.status(400)
    }

    try {
        let eleve = await Eleve.findOne({ where: { email: email }, raw: true })
        if (eleve == ! null) {
            return res.status(409).json({ message: `L'eleve ${prenom} ${nom} existe déjà !` })
        }

        eleve = await Eleve.create(req.body);
        return res.json({ message: 'Eleve créé', data: eleve })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }
}
