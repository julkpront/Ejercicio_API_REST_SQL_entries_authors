const { body, query } = require('express-validator');
const handleValidation = require('./handleValidation');

const validateGetAuthors = [
  query('email')
    .optional()
    .isEmail().withMessage('El email no tiene un formato válido'),
  handleValidation
];

const validateCreateAuthor = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio').bail()
    .isLength({ max: 45 }).withMessage('El nombre no puede superar los 45 caracteres'),

  body('surname')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio').bail()
    .isLength({ max: 45 }).withMessage('El apellido no puede superar los 45 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio').bail()
    .isEmail().withMessage('El email no tiene un formato válido').bail()
    .isLength({ max: 100 }).withMessage('El email no puede superar los 100 caracteres'),

  body('image')
    .optional()
    .trim()
    .isURL().withMessage('La imagen debe ser una URL válida').bail()
    .isLength({ max: 255 }).withMessage('La URL de la imagen no puede superar los 255 caracteres'),

  handleValidation
];

const validateUpdateAuthor = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio').bail()
    .isLength({ max: 45 }).withMessage('El nombre no puede superar los 45 caracteres'),

  body('surname')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio').bail()
    .isLength({ max: 45 }).withMessage('El apellido no puede superar los 45 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email del autor a actualizar es obligatorio').bail()
    .isEmail().withMessage('El email no tiene un formato válido'),

  body('image')
    .optional()
    .trim()
    .isURL().withMessage('La imagen debe ser una URL válida').bail()
    .isLength({ max: 255 }).withMessage('La URL de la imagen no puede superar los 255 caracteres'),

  handleValidation
];

const validateDeleteAuthor = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email del autor a borrar es obligatorio').bail()
    .isEmail().withMessage('El email no tiene un formato válido'),

  handleValidation
];

module.exports = {
  validateGetAuthors,
  validateCreateAuthor,
  validateUpdateAuthor,
  validateDeleteAuthor
};