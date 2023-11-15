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

    if (!formateurId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        let formateur = await Formateur.findOne({ where: { id: formateurId } })

        if (formateur === null) {
            return res.status(400).json({ message: `Ce formateur n'existe pas` })
        }

        return res.json({ data: formateur })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addFormateur = async (req, res) => {
    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
        return res.status(400)
    }

    try {
        let formateur = await Formateur.findOne({ where: { email: email }, raw: true })
        if (formateur == ! null) {
            return res.status(409).json({ message: `Le formateur ${prenom} ${nom} existe déjà!` })
        }

        formateur = await Formateur.create(req.body);
        return res.json({ message: 'Formateur créé', data: formateur })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err })
    }
}

exports.deleteFormateur = async (req, res) => {
    const formateurId = req.params.id;

    try {
        await Formateur.destroy({ where: { id: formateurId } });

        await Notation.destroy({ where: { id_formateur: formateurId } });

        return res.json({ message: 'Formateur et ses notes supprimés avec succès.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
};