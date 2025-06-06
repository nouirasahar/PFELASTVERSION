// routes/project.routes.js
const express = require("express");
const router = express.Router();

// --- IMPORTANT: Ensure this path points to your updated controller file --- 
const {
  generateProject,
  downloadZip,
  helloWorld,
  getTableNamesController,
  getTableNamesWithoutParams,
  getTableNamesWithQuery
} = require("../controllers/project.controller.js");

// Existing routes
router.post("/api/generate-project", generateProject);
router.get("/zip-download/:id/:token", downloadZip);
router.get("/hello", helloWorld);

// --- Routes for Table Names --- 
router.post("/api/tablenames", getTableNamesController); // Keep the POST route for backward compatibility
router.get("/api/tablenames", getTableNamesWithoutParams); // New GET route
router.get("/api/tablenames", getTableNamesWithQuery); // Nouvelle route GET avec query params

module.exports = router;
