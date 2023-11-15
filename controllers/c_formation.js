/** import des Modules */
const DB = require('../db.config');
const Formation = DB.Formation;

/** contenu */
exports.getAllFormations = (req, res) => {
    Formation.findAll()
        .then(formations => res.json({ data: formations }))
        .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }))

}

exports.getFormation = async (req, res) => {
    let formationId = parseInt(req.param.id);

    if (!formationId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        let formation = await Formation.findOne({ where: { id: formationId } })

        if (formation === null) {
            return res.status(400).json({ message: "Cette formation n/'existe pas" })
        }

        return res.json({ data: formation })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addFormation = async (req, res) => {
    const { nom, debut, fin } = req.body;

    if (!nom || !debut || !fin) {
        return res.status(400)
    }

    try {
        let formation = await Formation.findOne({ where: { nom: nom }, raw: true })
        if (formation == ! null) {
            return res.status(409).json({ message: `La formation ${nom} existe déjà !` })
        }

        formation = await Formation.create(req.body);
        return res.json({ message: 'Formation créé', data: formation })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }

}

exports.createFormation = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (req.user.role !== 'administrateur') {
            return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent créer des formations.' });
        }

        const newFormation = await DB.Formation.create({
            title,
            description,
        });

        return res.status(201).json({ message: 'Formation créée avec succès', data: newFormation });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la création de la formation', error: error.message });
    }
};