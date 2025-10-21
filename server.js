const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();

const dbFile = path.join(__dirname, "data.db");
const db = new sqlite3.Database(dbFile);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT, message TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });
  const stmt = db.prepare("INSERT INTO contacts (name,email,message) VALUES (?, ?, ?)");
  stmt.run(name, email, message, function(err) {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ ok: true, id: this.lastID });
  });
  stmt.finalize();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
