const { connect } = require('./dbConnection.js');
const { MongoClient, ObjectId } = require('mongodb');

const connectionParams = {
  host: 'cluster0.3isme4y.mongodb.net',
  dbName: 'DataTest',
  USER: 'glilamouna',
  PASS: 'rC0mE7'
};

async function fetchData() {
  const db = await connect(connectionParams);
  const data = {};
  for (const { name } of await db.listCollections().toArray()) {
    data[name] = await db.collection(name).find().toArray();
  }
  return data;
}

async function getTableNames() {
  return (await (await connect(connectionParams))
    .listCollections().toArray()).map(c => c.name);
}

async function getItemById(collection, id) {
  const db = await connect(connectionParams);
  return db.collection(collection).findOne({ _id: new ObjectId(id) });
}

async function updateItemById(collection, id, updateFields) {
  const db = await connect(connectionParams);
  delete updateFields._id;
  return db
    .collection(collection)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
}

async function deleteItemById(collection, id) {
  const db = await connect(connectionParams);
  return db.collection(collection).deleteOne({ _id: new ObjectId(id) });
}

async function deleteCollectionByName(collectionName) {
  const db = await connect(connectionParams);
  return db.collection(collectionName).drop();
}

module.exports = {
  fetchData,
  getTableNames,
  updateItemById,
  deleteItemById,
  deleteCollectionByName,
  getItemById
};
