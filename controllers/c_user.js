// c_user.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db.config");
const User = require('../models/m_user');


exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!role || (role !== 'eleve' && role !== 'formateur' && role !== 'administrateur')) {
            return res.status(400).json({ message: 'Rôle : "eleve", "formateur" ou "administrateur".' });
        }

        const user = await getUser(email, role);

        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }

        let userRole;

        if (role === 'administrateur') {
            userRole = 'administrateur';
        } else if (role === 'formateur') {
            userRole = 'formateur';
        } else {
            userRole = 'eleve';
        }

        const token = jwt.sign({ userId: user.id, role: userRole }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });

        res.status(200).json({ userId: user.id, token });
    } catch (error) {
        res.status(500).json({ error: error.message || "Erreur interne" });
    }
}

exports.register = async (req, res, next) => {
    try {
        const { email, password, role, formationId } = req.body;

        if (!role || (role !== 'eleve' && role !== 'formateur' && role !== 'administrateur')) {
            return res.status(400).json({ message: 'Rôle : "eleve", "formateur" ou "administrateur".' });
        }

        const existingUser = await getUser(email, role);

        if (existingUser) {
            return res.status(400).json({ error: "L'utilisateur existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;

        if (role === 'eleve') {
            if (!formationId) {
                return res.status(400).json({ error: "L'ID de formation est obligatoire pour un élève." });
            }

            const formation = await db.Formation.findOne({ where: { id: formationId } }); // Utilisez findOne avec where pour rechercher par ID
            if (!formation) {
                return res.status(400).json({ error: "Formation non trouvée" });
            }

            newUser = await db.Eleve.create({
                email: email,
                password: hashedPassword,
                id_formation: formationId,
            });
        } else if (role === 'formateur') {
            newUser = await db.Formateur.create({
                email: email,
                password: hashedPassword,
            });
        } else if (role === 'administrateur') {
            newUser = new User({
                email: email,
                password: hashedPassword,
                role: 'administrateur'
            });

            await newUser.save();
        }

        const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });

        res.status(201).json({ userId: newUser.id, token });
    } catch (error) {
        res.status(500).json({ error: error.message || "Erreur interne" });
    }
}


const getUser = async (email, role) => {
    try {
        if (role === 'eleve' || role === 'formateur') {
            return await (role === 'eleve' ? db.Eleve : db.Formateur).findOne({ where: { email: email }, raw: true });
        } else if (role === 'administrateur') {
            return await User.findOne({ email: email });
        }
    } catch (error) {
        throw error;
    }
}
