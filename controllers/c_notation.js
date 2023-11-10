/** import des Modules */
const DB = require('../db.config');
const Notation = DB.Notation;
/** contenu */
exports.getAllNotations = (req, res) => {
    Notation.findAll()
        .then(notations => res.json({ data: notations }))
        .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }))

}

exports.getNotation = async (req, res) => {
    let notationId = parseInt(req.param.id);

    //vérifier si le champ id est présent
    if (!notationId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        //récupération
        let notation = await Notation.findOne({ where: { id: notationId } })

        //test si résultat
        if (notation === null) {
            return res.status(400).json({ message: `il n'y a pas de notation existante` })
        }

        //renvoi de la notation trouvée
        return res.json({ data: notation })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addNotation = async (req, res) => {
    const { note, comment } = req.body;

    //validation des données reçues
    if (!note || !comment) {
        return res.status(400)
    }

    try {
        //vérification si la notation existe déjà
        let notation = await Notation.findOne({ where: { id: id, id_eleve: id_eleve, id_formateur: id_formateur }, raw: true })
        if (notation == ! null) {
            return res.status(409).json({ message: `La notation du formateur ${formateur.prenom} ${formateur.nom} existe déjà !` })
        }

        //Creation
        notation = await Notation.create(req.body);
        return res.json({ message: 'Notation créé', data: notation })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }



}