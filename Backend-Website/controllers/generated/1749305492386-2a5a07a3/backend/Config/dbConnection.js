const { MongoClient } = require('mongodb');
let client;

async function connect({
  host = 'cluster0.3isme4y.mongodb.net',
  dbName = 'DataTest',
  USER = 'glilamouna',
  PASS = 'rC0mE7'
}) {
  const auth = USER && PASS ? `${encodeURIComponent(USER)}:${encodeURIComponent(PASS)}@` : '';
  const uri = `mongodb+srv://${auth}${host}/${dbName}?retryWrites=true&w=majority`;
  console.log(`Connexion à MongoDB Atlas sur ${uri}`);

  try {
    if (client) {
      console.log('Fermeture de la connexion précédente');
      await client.close();
    }

    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connexion établie à MongoDB');
    return client.db(dbName);
  } catch (err) {
    console.error('Échec de la connexion :', err.message);
    throw err;
  }
}

module.exports = { connect };
