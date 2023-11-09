/** import Notation */
const { DataTypes } = require('sequelize');

/** modèle Notation */
module.exports = (sequelize) => {
    const Notation = sequelize.define('Notation', {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        note: {
            type: DataTypes.DECIMAL(4, 2),
            defaultValue: 0,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING(250),
            defaultValue: '',
            allowNull: false
        },
        id_eleve: {
            type: DataTypes.INTEGER(10),
            defaultValue: 0,
            allowNull: false
        },
        id_formateur: {
            type: DataTypes.INTEGER(10),
            defaultValue: 0,
            allowNull: false
        },
        id_module: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        }
    })

    return Notation;
}