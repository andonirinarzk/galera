/** Import modules */
const { Sequelize } = require('sequelize');
require('dotenv').config({ encoding: "latin1" });

/** Connexion à la base de donnée */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
}
)

/** DB: Mise en place des modèles */
const db = {}
db.sequelize = sequelize;
db.Formation = require('./models/m_formation')(sequelize);
db.Formateur = require('./models/m_formateur')(sequelize);
db.Module = require('./models/m_module')(sequelize);
db.Notation = require('./models/m_notation')(sequelize);
db.Eleve = require('./models/m_eleve')(sequelize);

/** DB: Mise en place des relation */
db.Formation.hasMany(db.Eleve, { foreignKey: 'id_formation' });
db.Formation.hasMany(db.Module, { foreignKey: 'id_formation' });
db.Eleve.belongsTo(db.Formation, { foreignKey: 'id_formation' });
db.Eleve.hasMany(db.Notation, { foreignKey: 'id_eleve' });
db.Formateur.hasMany(db.Notation, { foreignKey: 'id_formateur' });
db.Formateur.hasMany(db.Module, { foreignKey: 'id_formateur' });
db.Notation.belongsTo(db.Eleve, { foreignKey: 'id_eleve' });
db.Notation.belongsTo(db.Formateur, { foreignKey: 'id_formateur' });
db.Notation.belongsTo(db.Module, { foreignKey: 'id_module' });
db.Module.hasMany(db.Notation, { foreignKey: 'id_module' });
db.Module.belongsTo(db.Formateur, { foreignKey: 'id_formateur' });
db.Module.belongsTo(db.Formation, { foreignKey: 'id_formation' });

/** Syncronisation des modèles avec la base de donnée */
db.sequelize.sync({ alter: true })

module.exports = db;