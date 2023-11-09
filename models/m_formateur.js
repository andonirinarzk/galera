/** import Module */
const { DataTypes } = require('sequelize');

/** modèle Formateur */
module.exports = (sequelize) => {
    const Formateur = sequelize.define('Formateur', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        lastname: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true //validation des données
            },
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            is: /^[0-9a-f]{64}$/i,  //ici une contrainte
            allowNull: false
        }
    })

    return Formateur;
}