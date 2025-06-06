// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const cleanupOldProjects = require("./services/cleanup.service");
const projectRoutes = require("./routes/project.routes");
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration des sessions
app.use(session({
    secret: 'votre-secret-tres-securise',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettre à true si vous utilisez HTTPS
}));

app.use(express.json());
app.use(cors());
app.use("/downloads", express.static(path.join(__dirname, "public")));

// Routes
app.use("/", projectRoutes);

// Nettoyage des projets générés
cleanupOldProjects(); // Au démarrage
setInterval(cleanupOldProjects, 30 * 60 * 1000); // Toutes les 30 minutes

app.listen(PORT, () => {
  console.log(`Running: http://localhost:${PORT}/`);
});
