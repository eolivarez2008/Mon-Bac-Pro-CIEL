const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const crypto = require('crypto'); // Pour la sécurité
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURATION SÉCURITÉ ADMIN
const ADMIN_USER = "eolivarez";
// Le hash SHA256 de ton mot de passe "29Novembre2008*"
const ADMIN_PASSWORD_HASH = "8677c3856272506304543b57356269201979b00688029d2f623351f38e3e4a36";

// Middleware pour protéger les routes /api/admin/
const authMiddleware = (req, res, next) => {
    const auth = { login: ADMIN_USER, password: '29Novembre2008*' };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && login === ADMIN_USER && password === auth.password) {
        return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentification requise.');
};

// Connexion Base de données
const dbPath = path.resolve(__dirname, 'temoignages.db');
const db = new sqlite3.Database(dbPath);

// Table mise à jour : approved peut être 0 (attente), 1 (validé), 2 (bloqué)
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    firstname TEXT, 
    lastname TEXT, 
    classe TEXT, 
    message TEXT, 
    approved INTEGER DEFAULT 0,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// --- ROUTES PUBLIQUES ---

// Envoyer un témoignage
app.post('/api/temoignage', (req, res) => {
    const { firstname, lastname, classe, message } = req.body;
    const sql = "INSERT INTO messages (firstname, lastname, classe, message) VALUES (?, ?, ?, ?)";
    db.run(sql, [firstname, lastname, classe, message], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Succès" });
    });
});

// Récupérer uniquement les témoignages validés (approved = 1)
app.get('/api/messages', (req, res) => {
    db.all("SELECT * FROM messages WHERE approved = 1 ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- ROUTES ADMIN (PROTÉGÉES) ---

// Lister TOUS les messages pour la modération
app.get('/api/admin/messages', authMiddleware, (req, res) => {
    db.all("SELECT * FROM messages ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Action de modération : approve, block ou delete
app.post('/api/admin/moderate', authMiddleware, (req, res) => {
    const { id, action } = req.body;
    
    if (action === 'delete') {
        db.run("DELETE FROM messages WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Supprimé" });
        });
    } else {
        const status = (action === 'approve') ? 1 : 2;
        db.run("UPDATE messages SET approved = ? WHERE id = ?", [status, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Statut mis à jour" });
        });
    }
});

app.listen(3000, '0.0.0.0', () => console.log("Backend sécurisé prêt"));