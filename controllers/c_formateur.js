/** import des Modules */
const DB = require('../db.config');
const Formateur = DB.Formateur;
/** contenu */
exports.getAllFormateurs = (req, res) => {
    Formateur.findAll()
        .then(formateurs => res.json({ data: formateurs }))
        .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }))

}

exports.getFormateur = async (req, res) => {
    let formateurId = parseInt(req.param.id);

    //vérifier si le champ id est présent
    if (!formateurId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        //récupération
        let formateur = await Formateur.findOne({ where: { id: formateurId } })

        //test si résultat
        if (formateur === null) {
            return res.status(400).json({ message: `Ce formateur n'existe pas` })
        }

        //renvoi de la formateur trouvée
        return res.json({ data: formateur })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addFormateur = async (req, res) => {
    const { nom, prenom, email } = req.body;

    //validation des données reçues
    if (!nom || !prenom || !email) {
        return res.status(400)
    }

    try {
        //vérification si la formateur existe déjà
        let formateur = await Formateur.findOne({ where: { email: email }, raw: true })
        if (formateur == ! null) {
            return res.status(409).json({ message: `Le formateur ${prenom} ${nom} existe déjà!` })
        }

        //Creation
        formateur = await Formateur.create(req.body);
        return res.json({ message: 'Formateur créé', data: formateur })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }
}

