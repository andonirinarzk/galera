/** import des Modules */
const DB = require('../db.config');
const Module = DB.Module;
/** contenu */
exports.getAllModules = (req, res) => {
    Module.findAll()
        .then(modules => res.json({ data: modules }))
        .catch(e => res.status(500).json({ message: 'arf... Database error', error: e }))

}

exports.getModule = async (req, res) => {
    let moduleId = parseInt(req.param.id);

    if (!moduleId) {
        return res.json(400).json({ message: 'Il manque un paramètre' })
    }

    try {
        let module = await Module.findOne({ where: { id: moduleId } })

        if (module === null) {
            return res.status(400).json({ message: "Ce module n/'existe pas" })
        }

        return res.json({ data: module })
    } catch (err) {
        return res.status(500).json({ message: 'aie... Database Error', error: err })
    }
}

exports.addModule = async (req, res) => {
    const { nom, id_formation, id_formateur } = req.body;

    if (!nom || !id_formation || !id_formateur) {
        return res.status(400)
    }

    try {
        let module = await Module.findOne({ where: { nom: nom }, raw: true })
        if (module == ! null) {
            return res.status(409).json({ message: `Le module ${nom} existe déjà !` })
        }

        module = await Module.create(req.body);
        return res.json({ message: 'Module créé', data: module })
    } catch (err) {
        return res.status(500).json({ message: 'ouch... Database Error', error: err.message })
    }

}