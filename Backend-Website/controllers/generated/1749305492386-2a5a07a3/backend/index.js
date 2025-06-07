const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./Routes/routes.js');

app.use(express.json());
app.use(cors());
app.use('/api', apiRoutes);

app.listen(3306, () => console.log('Serveur démarré sur http://localhost:3306'));
