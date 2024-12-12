const express = require("express");
 // le module fs permet de manipuler les fichier
// on crée l'application expressJs
const myConnection = require("express-myconnection");
const mysql2 = require("mysql2");
const url = require("url");
const connection = require("express-myconnection");


// Configuration des options de connexion à la base de données
const optionConnection = {
    host: "localhost", // Adresse du serveur de base de données
    user: "root", // Nom d'utilisateur pour se connecter à la base de données
    password: "Izad97640", // Mot de passe pour l'utilisateur
    port: 3306, // Port par défaut pour MySQL
    database: "mobilegestion" // Nom de la base de données à utiliser
  };

// Création de l'application Express
const app = express();

// Configuration des vues et du moteur de rendu
app.set("views", "./views"); // Dossier où se trouvent les fichiers de vue
app.set('view engine', 'ejs'); // Utilisation de EJS comme moteur de rendu

// Middleware pour servir des fichiers statiques (CSS, images, etc.)
app.use(express.static("public")); // Dossier public pour les fichiers statiques

// Middleware pour établir une connexion à la base de données
app.use(myConnection(mysql2, optionConnection, "pool")); // Utilisation de myConnection pour gérer les connexions

// Middleware pour analyser les données des formulaires
app.use(express.urlencoded({ extended: true })); // Permet de traiter les données URL-encoded




// Route pour afficher les offres
app.get("/accueil", (req, res) => {
    // Connexion à la base de données pour récupérer les offres
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur); // Affiche l'erreur de connexion
        } else {
            // Exécution de la requête pour sélectionner toutes les offres
            connection.query("SELECT * FROM offers", [], (err, resulat) => {
                if (err) {
                    console.log(err); // Affiche l'erreur si la requête échoue
                } else {
                    console.log("resultat : ", resulat); // Affiche les résultats de la requête
                    res.render("accueil", { resulat }); // Rendre la vue "accueil" avec les résultats
                }
            });
        }
    });
}); 


app.get('/equipe', (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur); // Affiche l'erreur de connexion
        } else {
    const query = 'SELECT * FROM equipe';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.log("resultat : ", results); // Affiche les résultats de la requête
        res.render('equipe', { teamMembers: results }); // Passer les résultats à la vue
    });
}
    });

})

// Route pour envoyer un message
app.post('/equipe', (req, res) => {
    req.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion:', err);
            return res.status(500).end('Erreur de connexion à la base de données');
        }

        // Utiliser directement client_name sans séparation
        const { client_name, objet_du_message, message } = req.body;

        // Requête d'insertion
        const query = `
            INSERT INTO formulaire_de_contact 
            (nom_client, prenom_client, objet_du_message, message) 
            VALUES (?, ?, ?, ?)
        `;

        // Exécuter la requête
        connection.query(query, [client_name, '', objet_du_message, message], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion:', err);
                return res.status(500).end('Erreur lors de l\'envoi du message');
            }

            console.log('Message inséré avec succès', {
                id: results.insertId,
                nom: client_name,
                objet: objet_du_message,
                message: message
            });

            res.end('Message envoye avec succes !');
        });
    });
});




app.get("/seconnecter", (req, res) => {
    // Rendre la vue pour créer un compte
    res.render("seconnecter"); // Assurez-vous que le fichier EJS s'appelle "creer-compte.ejs"

});

app.post('/seconnecter', (req, res) => {
    const { last_name, first_name, identity_number, birth_date, address, email } = req.body;

    // Vérifiez que toutes les données sont présentes
    if (!last_name || !first_name || !identity_number || !birth_date || !address || !email) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Requête d'insertion
    const query = `
        INSERT INTO utilisateur (nom, prenom, Numero_identite, date_de_naissance, address, email) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    req.getConnection((err, connection) => { // La méthode getConnection est utilisée pour établir une connexion à la base de données.
        if (err) { // Si la connexion échoue, une erreur est renvoyée avec un message d'erreur approprié.
            console.error('Erreur de connexion:', err);
            return res.status(500).json({ message: 'Erreur de connexion à la base de données' });
        }

        connection.query(query, [last_name, first_name, identity_number, birth_date, address, email], (err, results) => { /* Une requête INSERT INTO est exécutée sur la base de données pour insérer 
            des données utilisateur (par exemple, last_name, first_name, etc.)*/
            if (err) { // Si une erreur survient lors de l'exécution de la requête SQL, une réponse d'erreur est renvoyée.
                console.error('Erreur lors de l\'insertion:', err); /*Si la requête réussit, la logique après ce code pourrait renvoyer une réponse indiquant que l'insertion 
                s'est bien déroulée (ce code n'inclut pas la réponse de succès, mais cela serait typiquement fait ici).*/
                return res.status(500).json({ message: 'Erreur lors de la création du compte' });
            }

            // Afficher les résultats dans la console
            console.log('Utilisateur créé avec succès', {
                id: results.insertId,
                nom: last_name,
                prenom: first_name,
                Numero_identite:identity_number,
                date_de_naissance:birth_date,
                address:address,
                email: email
            });

            // Rediriger ou renvoyer une réponse
            res.json({ message: 'Compte créé avec succès !' });
        });
    });
});


app.listen(3004, () => {
    console.log("serveur dispo");
});



module.exports = app;
