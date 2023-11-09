/** les Modules */
const express = require('express'); //permettre accès aux API
const cors = require('cors'); // définir qui peut accéder à l'API
const mongoose = require('mongoose')
const { use } = require('bcrypt/promises');


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

/** Démarrage de l'API */

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
app.listen(process.env.API_PORT, () => {
    console.log("API is running!");
});


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