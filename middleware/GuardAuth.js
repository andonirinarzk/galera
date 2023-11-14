const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ encoding: "latin1" });

module.exports = (requiredRoles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

            // Vérification du rôle de l'utilisateur
            if (!requiredRoles.includes(decodedToken.role)) {
                throw "Invalid user role";
            }

            // Ajout du rôle
            req.auth = {
                userId: decodedToken.userId,
                role: decodedToken.role,
            };

            next(); // Accès autorisé
        } catch {
            res.status(401).json({
                error: new Error("Invalid request!"),
            });
        }
    };
};
