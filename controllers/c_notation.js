/** import des Modules */
const DB = require('../db.config');
const Notation = DB.Notation;

/** contenu */
exports.getAllNotations = (req, res) => {
    // Si l'utilisateur est un élève, afficher seulement les notations de l'élève
    if (req.auth.role === 'eleve') {
        Notation.findAll({ where: { id_eleve: req.auth.userId } })
            .then(notations => res.json({ data: notations }))
            .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }));
    } else {
        // Si l'utilisateur est un formateur, afficher seulement les notations pour ce formateur
        Notation.findAll({ where: { id_formateur: req.auth.userId } })
            .then(notations => res.json({ data: notations }))
            .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }));
    }
}

exports.getNotation = async (req, res) => {
    let notationId = parseInt(req.params.id);

    //vérifier si le champ id est présent
    if (!notationId) {
        return res.json(400).json({ message: 'Il manque un paramètre' });
    }

    try {
        //récupération
        let notation = await Notation.findOne({ where: { id: notationId } });

        //test si résultat
        if (notation === null) {
            return res.status(400).json({ message: `il n'y a pas de notation existante` });
        }

        // Si l'utilisateur est un élève, vérifier que la notation appartient à l'élève
        if (req.auth.role === 'eleve' && notation.id_eleve !== req.auth.userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Si l'utilisateur est un formateur, vérifier que la notation appartient au formateur
        if (req.auth.role === 'formateur' && notation.id_formateur !== req.auth.userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        //renvoi de la notation trouvée
        return res.json({ data: notation });
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err });
    }
}

exports.addNotation = async (req, res) => {
    const { note, comment, id_formateur } = req.body;

    //validation des données reçues
    if (!note || !comment || !id_formateur) {
        return res.status(400).json({ message: 'Paramètres manquants' });
    }

    try {
        // Si l'utilisateur n'est pas un élève, il ne peut pas ajouter de notation
        if (req.auth.role !== 'eleve') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        //vérification si la notation existe déjà
        let notationExists = await Notation.findOne({ where: { id_eleve: req.auth.userId, id_formateur: id_formateur }, raw: true });

        if (notationExists) {
            return res.status(409).json({ message: 'La notation pour ce formateur existe déjà' });
        }

        // Création de la notation
        const newNotation = await Notation.create({ note, comment, id_eleve: req.auth.userId, id_formateur });

        return res.json({ message: 'Notation créée', data: newNotation });
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err });
    }
}
