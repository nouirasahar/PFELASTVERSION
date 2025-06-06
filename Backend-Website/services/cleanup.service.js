const fs = require("fs");
const path = require("path");

const generatedDir = path.join(__dirname, "..", "controllers", "generated");


const cleanupOldProjects = () => {
  console.log("Starting cleanup of old projects...");

  if (!fs.existsSync(generatedDir)) {
    console.log("The generated folder does not exist");
    return;
  }

  fs.readdir(generatedDir, (err, files) => {
    if (err) return console.error("Error reading the folder:", err);
    if (files.length === 0) return console.log("No projects to clean");

    files.forEach((dir) => {
      const dirPath = path.join(generatedDir, dir);
      fs.stat(dirPath, (err, stats) => {
        if (err) return console.error(`Error reading stats for ${dir}:`, err);
        const age = Date.now() - stats.ctimeMs;
        const threshold = 30 * 60 * 1000; // 30 minutes
        if (age > threshold) {
          fs.rm(dirPath, { recursive: true, force: true }, (err) => {
            if (err) console.error(`Error deleting ${dir}:`, err);
            else console.log(`Project ${dir} successfully deleted`);
          });
        }
      });
    });
  });
};

module.exports = cleanupOldProjects;
