/** import des Modules */
const DB = require('../db.config');
const Formation = DB.Formation;
console.log(Formation)
/** contenu */
exports.getAllFormations = (req, res) => {
    Formation.findAll()
        .then(formations => res.json({ data: formations }))
        .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }))

}

exports.getFormation = async (req, res) => {
    let formationId = parseInt(req.param.id);

    //vérifier si le champ id est présent
    if (!formationId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        //récupération
        let formation = await Formation.findOne({ where: { id: formationId } })

        //test si résultat
        if (formation === null) {
            return res.status(400).json({ message: "Cette formation n/'existe pas" })
        }

        //renvoi de la formation trouvée
        return res.json({ data: formation })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addFormation = async (req, res) => {
    const { nom, debut, fin } = req.body;

    //validation des données reçues
    if (!nom || !debut || !fin) {
        return res.status(400)
    }

    try {
        //vérification si la formation existe déjà
        let formation = await Formation.findOne({ where: { nom: nom }, raw: true })
        if (formation == ! null) {
            return res.status(409).json({ message: `La formation ${nom} existe déjà !` })
        }

        //Creation
        formation = await Formation.create(req.body);
        return res.json({ message: 'Formation créé', data: formation })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }



}