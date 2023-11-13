/** les Modules */
const express = require('express'); //permettre accès aux API
const cors = require('cors'); // définir qui peut accéder à l'API
const mongoose = require('mongoose')



/** Connexion à la base de donnée */
let DB = require('./db.config')

/** Initialisation de l'API */
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorisation"
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Routers */
const formation_router = require('./routers/r_formation');
const eleve_router = require('./routers/r_eleve');
const formateur_router = require('./routers/r_formateur');
const notation_router = require('./routers/r_notation');
const module_router = require('./routers/r_module');
const user_router = require('./routers/r_user');

/** Routage principal */
app.get('/', (req, res) => res.send(`Nous sommes en ligne, bien joué!!`))
app.use('/auth', user_router)
app.use('/formations', formation_router)
app.use('/formateurs', formateur_router)
app.use('/modules', module_router)
app.use('/notations', notation_router)
app.use('/eleves', eleve_router)
app.all('*', (req, res) => res.status(501).send('Cette fonction n\'est pas autorisée'))


/** Démarrage de l'API */
let server = null;
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB: connexion ok');
    } catch (error) {
        console.log('MongoDB:Database error', error);
    }
}

const connectMariaDB = async () => {
    try {
        await DB.sequelize.authenticate();
        console.log('MariaDB: connexion ok');
    } catch (error) {
        console.log('MariaDB: Database error', error);
    }
}

// Connexion à la base de données MongoDB
connectMongoDB();

// Connexion à la base de données MariaDB
connectMariaDB();

// Démarrage du serveur
server = app.listen(process.env.API_PORT, () => {
    console.log("API: Magnifique, ça fonctionne!!!!");
});

module.exports = server;
// mongoose
//     .connect(process.env.MONGODB_URL)
//     .then(() => {
//         console.log('MongoDB, connexion ok')

//         //imbrication de la partie MariaDB (pas ideal)
//         DB.authenticate()
//             .then(() => console.log('MariaDB, connexion ok '))
//             .then(() => {
//                 app.listen(process.env.API_PORT, () => {
//                     console.log("Magnifico l'API est lancé!!")
//                 })
//             })
//             .catch(e => console.log('Database error - MariaDB', e))
//     })
//     .catch(e => console.log('Database ERROR - MONGODB', e))