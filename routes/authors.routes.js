const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors.controller');
const { validateGetAuthors, validateCreateAuthor, validateUpdateAuthor, validateDeleteAuthor } = require('../middlewares/authors.validators');

router.get('/', validateGetAuthors, authorsController.getAuthors);
router.post('/', validateCreateAuthor, authorsController.createAuthor);
router.put('/', validateUpdateAuthor, authorsController.updateAuthor);
router.delete('/', validateDeleteAuthor, authorsController.deleteAuthor);

module.exports = router;