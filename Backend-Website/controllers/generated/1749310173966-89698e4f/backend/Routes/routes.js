const express = require('express');
const router = express.Router();
const {
  fetchData,
  getTableNames,
  updateItemById,
  deleteItemById,
  deleteCollectionByName,
  getItemById
} = require('../Config/services.js');

router.get('/getall', (req, res) =>
  fetchData().then(data => res.json(data)).catch(err => res.status(500).send('Erreur'))
);

router.get('/tablenames', async (req, res) => {
  try {
    const names = await getTableNames();
    console.log(names);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  try {
    const item = await getItemById(table, id);
    if (!item) {
      return res.status(404).json({ error: 'Élément non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.put('/update/:table/:id', async (req, res) => {
  try {
    console.log('Requête PUT /update', req.params, 'corps:', req.body);
    const result = await updateItemById(req.params.table, req.params.id, req.body);
    const success = result.modifiedCount > 0;
    res.json({ success, matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    console.error('Erreur lors de la mise à jour:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/delete/:table/:id', (req, res) => {
  deleteItemById(req.params.table, req.params.id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.delete('/delete/:table', async (req, res) => {
  try {
    await deleteCollectionByName(req.params.table);
    res.json({ message: `${req.params.table} collection supprimée avec succès` });
  } catch (err) {
    res.status(500).json({ error: 'Échec de la suppression de la collection' });
  }
});

module.exports = router;
