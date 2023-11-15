/** import des Modules */
const DB = require('../db.config');
const Formateur = DB.Formateur;
const Notation = DB.Notation;
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

        //renvoi duformateur trouvée
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

exports.deleteFormateur = async (req, res) => {
    const formateurId = req.params.id;

    try {
        // Supprimer le formateur
        await Formateur.destroy({ where: { id: formateurId } });

        // Supprimer toutes les notes liées à ce formateur
        await Notation.destroy({ where: { id_formateur: formateurId } });

        return res.json({ message: 'Formateur et ses notes supprimés avec succès.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
};