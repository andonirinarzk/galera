/** import des Modules */
const DB = require('../db.config');
const Notation = DB.Notation;

/** contenu */
exports.getAllNotations = (req, res) => {

    if (req.auth.role === 'administrateur') {
        Notation.findAll()
            .then(notations => res.json({ data: notations }))
            .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }));
    } else {

        if (req.auth.role === 'eleve') {
            Notation.findAll({ where: { id_eleve: req.auth.userId } })
                .then(notations => res.json({ data: notations }))
                .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }));
        } else {

            Notation.findAll({ where: { id_formateur: req.auth.userId } })
                .then(notations => res.json({ data: notations }))
                .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }));
        }

    }
}
exports.getNotation = async (req, res) => {
    let notationId = parseInt(req.params.id);

    if (!notationId) {
        return res.json(400).json({ message: 'Il manque un paramètre' });
    }

    try {

        let notation = await Notation.findOne({ where: { id: notationId } });

        if (notation === null) {
            return res.status(400).json({ message: `il n'y a pas de notation existante` });
        }

        if (req.auth.role === 'eleve' && notation.id_eleve !== req.auth.userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        if (req.auth.role === 'formateur' && notation.id_formateur !== req.auth.userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        return res.json({ data: notation });
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err });
    }
}

exports.addNotation = async (req, res) => {
    const { note, comment, id_formateur } = req.body;

    if (!note || !comment || !id_formateur) {
        return res.status(400).json({ message: 'Paramètres manquants' });
    }

    try {

        if (req.auth.role !== 'eleve') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        let notationExists = await Notation.findOne({ where: { id_eleve: req.auth.userId, id_formateur: id_formateur }, raw: true });

        if (notationExists) {
            return res.status(409).json({ message: 'La notation pour ce formateur existe déjà' });
        }

        const newNotation = await Notation.create({ note, comment, id_eleve: req.auth.userId, id_formateur });

        return res.json({ message: 'Notation créée', data: newNotation });
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err });
    }
}
