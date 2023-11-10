const User = require('../models/m_administrateur');
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config({ encoding: "latin1" });
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, parseInt(process.env.BCRYPTSALT))
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            })

            user.save()
                .then(() => res.status(200).json({ message: "utilisateur créé" }))
                .catch((error) => res.status(400).json({ error }))

        })
        .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ error: "Utilisateur non trouvé " });
            }

            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(400).json({ error: "Mot de passe incorrect!" })
                    }

                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
                            expiresIn: "1h"
                        })
                    })

                })
                .catch((error) => res.status(500).json({ error }));

        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}
