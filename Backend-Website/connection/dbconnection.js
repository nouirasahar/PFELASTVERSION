const { MongoClient } = require("mongodb");

// Function to test MongoDB connection
const testMongoConnection = async (uri, dbName) => {
  // Add a timeout for connection attempts
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }); 
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 }); 
    console.log("MongoDB connection successful.");
    return true;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw new Error("Database connection failed"); 
  } finally {
    // Ensure the client is always closed
    await client.close(); 
  }
};

// Function to get collection names from a MongoDB database
const getCollectionNames = async (host, dbName, username, password) => {
  // Construct URI (assuming Atlas format, adjust if needed)
  const auth = username && password ? `${username}:${password}@` : '';
  const uri = `mongodb+srv://${auth}${host}/${dbName}?retryWrites=true&w=majority`;
  
  // Add a timeout for connection attempts
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }); 
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);
    console.log(`Successfully retrieved collection names for db '${dbName}':`, names);
    return names;
  } catch (err) {
    console.error(`Failed to get collection names for db '${dbName}':`, err.message);
    // Throw a specific error to be caught by the controller
    throw new Error(`Failed to retrieve collection names: ${err.message}`); 
  } finally {
    // Ensure the client is always closed
    await client.close(); 
  }
};

module.exports = { 
  testMongoConnection, 
  getCollectionNames 
};
