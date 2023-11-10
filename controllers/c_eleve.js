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

    //vérifier si le champ id est présent
    if (!eleveId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        //récupération
        let eleve = await Eleve.findOne({ where: { id: eleveId } })

        //test si résultat
        if (eleve === null) {
            return res.status(400).json({ message: `Cet eleve n'existe pas` })
        }

        //renvoi de la eleve trouvée
        return res.json({ data: eleve })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addEleve = async (req, res) => {
    const { nom, prenom, email } = req.body;

    //validation des données reçues
    if (!nom || !prenom || !email) {
        return res.status(400)
    }

    try {
        //vérification si la eleve existe déjà
        let eleve = await Eleve.findOne({ where: { email: email }, raw: true })
        if (eleve == ! null) {
            return res.status(409).json({ message: `L'eleve ${prenom} ${nom} existe déjà !` })
        }

        //Creation
        eleve = await Eleve.create(req.body);
        return res.json({ message: 'Eleve créé', data: eleve })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }
}

exports.signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà dans la base de données des élèves
        const existingEleve = await Eleve.findOne({ where: { email } });

        if (existingEleve) {
            return res.status(409).json({ message: `L'élève ${email} existe déjà !` });
        }

        // Créer un nouvel élève dans la base de données des élèves
        const newEleve = await Eleve.create({ email, password: await bcrypt.hash(password, parseInt(process.env.BCRYPTSALT)) });

        // Générer un token
        const token = jwt.sign({ userId: newEleve.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({ message: "Élève inscrit avec succès", data: newEleve, token });
    } catch (error) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe dans la base de données des élèves
        const eleve = await Eleve.findOne({ where: { email } });

        if (!eleve) {
            return res.status(400).json({ error: "Élève non trouvé" });
        }

        // Vérifier si le mot de passe est correct
        const validPassword = await bcrypt.compare(password, eleve.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }

        // Générer un token pour l'authentification
        const token = jwt.sign({ userId: eleve.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ userId: eleve.id, token });
    } catch (error) {
        res.status(500).json({ error });
    }
}
