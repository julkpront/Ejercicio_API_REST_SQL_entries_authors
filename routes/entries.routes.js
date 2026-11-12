const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entries.controller');
const {
  validateGetEntries,
  validateCreateEntry,
  validateUpdateEntry,
  validateDeleteEntry
} = require('../middlewares/entries.validators');


router.get('/', validateGetEntries, entriesController.getEntries);
router.post('/', validateCreateEntry, entriesController.createEntry);
router.put('/', validateUpdateEntry, entriesController.updateEntry);
router.delete('/', validateDeleteEntry, entriesController.deleteEntry);

module.exports = router;