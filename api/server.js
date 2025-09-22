const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// La base de données sera stockée dans le dossier api
const dbPath = path.resolve(__dirname, 'temoignages.db');
const db = new sqlite3.Database(dbPath);

// Création de la table
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    firstname TEXT, 
    lastname TEXT, 
    classe TEXT, 
    message TEXT, 
    approved BOOLEAN DEFAULT 0,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Route pour recevoir un témoignage
app.post('/api/temoignage', (req, res) => {
    const { firstname, lastname, classe, message } = req.body;
    const sql = "INSERT INTO messages (firstname, lastname, classe, message) VALUES (?, ?, ?, ?)";
    db.run(sql, [firstname, lastname, classe, message], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Succès" });
    });
});

// Route pour envoyer les témoignages validés au carrousel
app.get('/api/messages', (req, res) => {
    db.all("SELECT * FROM messages WHERE approved = 1 ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Route Admin rapide (pour que tu puisses valider tes tests sans SQL)
app.get('/api/admin/approve-all', (req, res) => {
    db.run("UPDATE messages SET approved = 1", (err) => {
        if (err) return res.status(500).send(err);
        res.send("Tous les messages sont désormais visibles sur le site !");
    });
});

app.listen(3000, '0.0.0.0', () => console.log("Backend prêt sur le port 3000"));