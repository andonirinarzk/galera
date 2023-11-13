// c_user.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db.config");  // Assurez-vous que le chemin est correct

exports.signup = async (req, res, next) => {
    try {
        const { email, password, role, id_formation } = req.body;

        if (!role || (role !== 'élève' && role !== 'formateur' && role !== 'administrateur')) {
            return res.status(400).json({ message: 'Rôle : "élève", "formateur" ou "administrateur".' });
        }

        const existingUser = await getUser(email, role);

        if (existingUser) {
            return res.status(409).json({ message: `Un utilisateur avec l'email ${email} existe déjà !` });
        }

        let newUser;

        if (role === 'élève' || role === 'formateur') {
            newUser = await (role === 'élève' ? db.Eleve : db.Formateur).create({
                email,
                password: await bcrypt.hash(password, parseInt(process.env.BCRYPTSALT)),
                id_formation: id_formation,  // Assurez-vous de fournir la valeur d'id_formation
            });
        } else if (role === 'administrateur') {
            newUser = await db.User.create({
                email,
                password: await bcrypt.hash(password, parseInt(process.env.BCRYPTSALT)),
                role,
            });
        }

        const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({ message: "Utilisateur inscrit avec succès", data: newUser, token });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!role || (role !== 'élève' && role !== 'formateur' && role !== 'administrateur')) {
            return res.status(400).json({ message: 'Rôle : "élève", "formateur" ou "administrateur".' });
        }

        const user = await getUser(email, role);

        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ userId: user.id, token });
    } catch (error) {
        res.status(500).json({ error });
    }
}

async function getUser(email, role) {
    try {
        if (role === 'élève' || role === 'formateur') {
            return await (role === 'élève' ? db.Eleve : db.Formateur).findOne({ where: { email: email }, raw: true });
        } else if (role === 'administrateur') {
            return await db.User.findOne({ where: { email: email }, raw: true });
        }
    } catch (error) {
        throw error;
    }
}
