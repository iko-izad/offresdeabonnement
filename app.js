const http = require('http');
const index = require('./index.js');  // Import du fichier index.js

// Création du serveur HTTP avec la fonction du module index.js comme gestionnaire de requêtes
const server = http.createServer(index);

// Définir le port sur lequel le serveur va écouter
const PORT = 3004;

// Le serveur écoute les requêtes sur 'localhost' et le port spécifié
server.listen(PORT, 'localhost', () => {
    console.log(" - Le serveur est activé au port :", PORT);
});
