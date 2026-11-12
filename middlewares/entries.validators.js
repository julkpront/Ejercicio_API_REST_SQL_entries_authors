const { body, query } = require('express-validator');
const handleValidation = require('./handleValidation');
const authorModel = require('../models/authors.model');

const authorExists = async (email) => {
  const autores = await authorModel.getAuthorByEmail(email);

  if (autores.length === 0) {
    throw new Error('No existe ningún autor con ese email');
  }

  return true;
};

const validateGetEntries = [
  query('email')
    .optional()
    .isEmail()
    .withMessage('El email no tiene un formato válido'),
  handleValidation
];

const validateCreateEntry = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio').bail()//.bail() significa “si esta regla falla, no sigas con las siguientes de este campo”
    .isLength({ max: 100 }).withMessage('El título no puede superar los 100 caracteres'),

  body('content')
    .trim()
    .notEmpty().withMessage('El contenido es obligatorio'),

  body('email')
  .trim()
  .notEmpty().withMessage('El email del autor es obligatorio').bail()
  .isEmail().withMessage('El email no tiene un formato válido').bail()
  .custom(authorExists),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 15 }).withMessage('La categoría no puede superar los 15 caracteres'),

  handleValidation
];

const validateUpdateEntry = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título de la entry a modificar es obligatorio').bail()
    .isLength({ max: 100 }).withMessage('El título no puede superar los 100 caracteres'),

  body('content')
    .trim()
    .notEmpty().withMessage('El contenido es obligatorio'),

  body('email')
  .trim()
  .notEmpty().withMessage('El email del autor es obligatorio').bail()
  .isEmail().withMessage('El email no tiene un formato válido').bail()
  .custom(authorExists),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 15 }).withMessage('La categoría no puede superar los 15 caracteres'),

  handleValidation
];

const validateDeleteEntry = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título de la entry a borrar es obligatorio').bail()
    .isLength({ max: 100 }).withMessage('El título no puede superar los 100 caracteres'),

  handleValidation
];

module.exports = {
  validateGetEntries,
  validateCreateEntry,
  validateUpdateEntry,
  validateDeleteEntry
};