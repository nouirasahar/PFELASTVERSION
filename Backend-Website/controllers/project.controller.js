const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const archiver = require("archiver");

// --- IMPORTANT: Verify this path is correct for your structure --- 
// It assumes 'connection' and 'controllers' are sibling directories under 'Backend-Website'
const { testMongoConnection, getCollectionNames } = require("../connection/dbconnection.js"); 

const generateProject = async (req, res) => {
    const { frontend, backend, host, dbName, username, password, TypeDB, port } = req.body;
    console.log("Received POST request for /api/generate-project...");
    console.log("Parameters received:", { backend, host, dbName, username, password, frontend, port });

    // Stocker les paramètres de connexion dans la session de l'utilisateur
    req.session.connectionParams = {
        host,
        dbName,
        username,
        password
    };

    const scriptPath = backend ? path.join(__dirname, "Backend", backend, `run-${backend}-${TypeDB}.sh`) : null;
    const scriptPath2 = frontend ? path.join(__dirname, "Frontend", frontend, `run-${frontend}.sh`) : null;

    const uniqueId = `${Date. now()}-${crypto. randomBytes(4) . toString( 'hex' )}`.replace(/[^a-zA-Z0-9 _-]/g, '');
    const secret = process.env.DOWNLOAD_SECRET || 'supersecret';
    const token = crypto.createHmac('sha256', secret).update(uniqueId).digest('hex');
    const generatedBaseDir = path.join(__dirname, 'generated'); 
    const projectDir = path.join(generatedBaseDir, uniqueId);
    
    try {
        fs.mkdirSync(projectDir, { recursive: true });
        console.log(`Project directory created at ${projectDir}`);

        if (TypeDB && TypeDB.toLowerCase().includes('mongo')) {
            const auth = username && password ? `${username}:${password}@` : '';
            const uri = `mongodb+srv://${auth}${host}/${dbName}?retryWrites=true&w=majority`; 
            console.log(`Attempting MongoDB connection to: ${host}/${dbName}`);
            await testMongoConnection(uri, dbName); 
        }

        // Send response immediately after validation and directory creation
        res.json({ message: "Project generation started.", uniqueId, token });

        // --- Backend Script Execution --- 
        const executeBackend = () => new Promise((resolve, reject) => {
            if (!backend || !scriptPath) {
                console.log("No backend script specified, skipping.");
                return resolve();
            }
            if (!fs.existsSync(scriptPath)) {
                console.error(`Backend script not found: ${scriptPath}`);
                return reject(new Error(`Backend script not found: ${scriptPath}`));
            }
            // Pass parameters to backend script
            const command = `bash "${scriptPath}" "${host || ''}" "${dbName || ''}" "${username || ''}" "${password || ''}" "${port || ''}" "${projectDir}" > log_backend_${uniqueId}.txt 2>&1`;
            console.log(`Executing backend command: ${command}`);
            exec(command, (err, stdout, stderr) => {
                const logFilePath = path.join(process.cwd(), `log_backend_${uniqueId}.txt`);
                let logContent = '';
                if (fs.existsSync(logFilePath)) {
                    logContent = fs.readFileSync(logFilePath, 'utf8');
                }
                if (err) {
                    console.error(`Error executing backend script: ${err.message}`);
                    console.error(`Backend Script stderr: ${stderr}`);
                    console.error(`Backend Script log: ${logContent}`);
                    reject(new Error(`Backend script execution failed. See logs for details. Log file: ${logFilePath}`)); 
                } else {
                    console.log(`Backend Script executed successfully.`);
                    console.log(`Backend Script stdout: ${stdout}`);
                    console.log(`Backend Script log: ${logContent}`);
                    resolve(); 
                }
            });
        });

        // --- Frontend Script Execution --- 
        const executeFrontend = () => new Promise((resolve, reject) => {
            if (!frontend || !scriptPath2) {
                console.log("No frontend script specified, skipping.");
                return resolve();
            }
             if (!fs.existsSync(scriptPath2)) {
                console.error(`Frontend script not found: ${scriptPath2}`);
                return reject(new Error(`Frontend script not found: ${scriptPath2}`));
            }
            const frontendCwd = path.dirname(scriptPath2);
            
            // --- MODIFICATION HERE: Pass DB credentials to frontend script --- 
            const dbHost = host || '';
            const databaseName = dbName || '';
            const dbUser = username || '';
            const dbPass = password || ''; // Be cautious about command line passwords

            // Arguments passed: 1=projectDir, 2=dbHost, 3=databaseName, 4=dbUser, 5=dbPass
            const command = `bash "${scriptPath2}" "${projectDir}" "${dbHost}" "${databaseName}" "${dbUser}" "${dbPass}" > log_frontend_${uniqueId}.txt 2>&1`;
            // --- End Modification --- 

            console.log(`Executing frontend command: ${command} in CWD: ${frontendCwd}`);
            exec(command, { cwd: frontendCwd }, (err, stdout, stderr) => {
                const logFilePath = path.join(process.cwd(), `log_frontend_${uniqueId}.txt`);
                let logContent = '';
                if (fs.existsSync(logFilePath)) {
                    logContent = fs.readFileSync(logFilePath, 'utf8');
                }
                if (err) {
                    console.error(`Error executing frontend script: ${err.message}`);
                    console.error(`Frontend Script stderr: ${stderr}`);
                    console.error(`Frontend Script log: ${logContent}`);
                    reject(new Error(`Frontend script execution failed. See logs for details. Log file: ${logFilePath}`)); 
                } else {
                    console.log(`Frontend Script executed successfully.`);
                    console.log(`Frontend Script stdout: ${stdout}`);
                    console.log(`Frontend Script log: ${logContent}`);
                    resolve(); 
                }
            });
        });

        // Chain the execution: Backend -> Frontend -> Final Log
        console.log("Starting backend script execution...");
        executeBackend()
            .then(() => {
                console.log("Backend script finished. Starting frontend script execution...");
                return executeFrontend();
            })
            .then(() => {
                console.log(`Project generation process completed for ${uniqueId} at ${projectDir}`);
            })
            .catch(err => {
                console.error(`Error during project generation for ${uniqueId}:`, err.message);
            });

    } catch (error) {
        console.error('Error during initial project setup:', error.message);
        if (fs.existsSync(projectDir)) {
             try {
                 fs.rmSync(projectDir, { recursive: true, force: true });
                 console.log(`Cleaned up failed project directory: ${projectDir}`);
             } catch (cleanupError) {
                 console.error(`Failed to cleanup directory ${projectDir}:`, cleanupError);
             }
        }
        if (!res.headersSent) {
             return res.status(400).json({ message: error.message || 'Project generation setup failed' });
        }
    }
};

// --- New Controller Function for Table Names --- 
const getTableNamesController = async (req, res) => {
    // Extract credentials from request body
    const { host, dbName, username, password } = req.body;
    console.log(`Received POST request for /api/tablenames for db: ${dbName}@${host}`);

    // Basic validation
    if (!host || !dbName) {
        return res.status(400).json({ message: 'Missing required fields: host and dbName are required.' });
    }

    try {
        // Call the utility function from dbconnection.js
        const names = await getCollectionNames(host, dbName, username, password);
        // Send the names back as JSON
        res.json(names);
    } catch (error) {
        // Handle errors (e.g., connection failure, auth failure)
        console.error('Error in getTableNamesController:', error.message);
        // Send a generic server error message
        res.status(500).json({ message: error.message || 'Failed to retrieve collection names.' });
    }
};

// --- New Controller Function for Table Names without parameters --- 
const getTableNamesWithoutParams = async (req, res) => {
    try {
        // Récupérer les paramètres de connexion depuis la session de l'utilisateur
        const connectionParams = req.session.connectionParams;

        if (!connectionParams || !connectionParams.host || !connectionParams.dbName) {
            return res.status(400).json({
                message: 'No active database connection. Please connect to a database first.'
            });
        }

        console.log(`Getting table names for db: ${connectionParams.dbName}@${connectionParams.host}`);

        // Call the utility function from dbconnection.js with the stored parameters
        const names = await getCollectionNames(
            connectionParams.host,
            connectionParams.dbName,
            connectionParams.username,
            connectionParams.password
        );
        
        // Send the names back as JSON
        res.json(names);
    } catch (error) {
        console.error('Error in getTableNamesWithoutParams:', error.message);
        res.status(500).json({ message: error.message || 'Failed to retrieve collection names.' });
    }
};

// --- Download Zip Function --- 
const downloadZip = (req, res) => {
    const { id, token } = req.params;
    const secret = process.env.DOWNLOAD_SECRET || 'supersecret';
    const expectedToken = crypto.createHmac('sha256', secret).update(id).digest('hex');

    if (token !== expectedToken) {
        console.log(`Download forbidden for ID ${id}: Invalid token`);
        return res.sendStatus(403);
    }

    const projectDir = path.join(__dirname, 'generated', id); 
    if (!fs.existsSync(projectDir)) {
        console.log(`Download failed for ID ${id}: Project directory not found at ${projectDir}`);
        return res.sendStatus(404);
    }

    console.log(`Starting ZIP download for project ID: ${id}`);
    const archive = archiver('zip', {
        zlib: { level: 9 } 
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archiver warning: ', err);
      } else {
        console.error('Archiver error during zipping:', err);
        if (!res.headersSent) {
             res.status(500).send('Warning during ZIP creation, check logs.');
        }
      }
    });

   
    archive.on('error', (err) => {
        console.error('Archiver error:', err.message);
        res.sendStatus(500);
    });

    res.attachment(`project_${id}.zip`);
    archive.pipe(res);

    archive.directory(projectDir, false);
    archive.finalize();
};

// --- Hello World Function --- 
const helloWorld = (req, res) => {
    res.send("Hello World!");
};

// --- Controller Function for Table Names with query params (GET) --- 
const getTableNamesWithQuery = async (req, res) => {
    const { host, dbName, username, password } = req.query;
    if (!host || !dbName) {
        return res.status(400).json({ message: 'Missing required fields: host and dbName are required.' });
    }
    try {
        const names = await getCollectionNames(host, dbName, username, password);
        res.json(names);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to retrieve collection names.' });
    }
};

// --- Export Functions --- 
module.exports = {
    generateProject,
    downloadZip,
    helloWorld,
    getTableNamesController,
    getTableNamesWithoutParams,
    getTableNamesWithQuery
};
