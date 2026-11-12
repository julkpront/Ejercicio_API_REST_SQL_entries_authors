const authorModel = require('../models/authors.model');

const getAuthors = async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      const encontrados = await authorModel.getAuthorByEmail(email);

      if (encontrados.length === 0) {
        return res.status(404).json({ message: `No existe ningún autor con el email '${email}'` });
      }

      return res.status(200).json(encontrados[0]);
    }

    const autores = await authorModel.getAllAuthors();
    res.status(200).json(autores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { name, surname, email, image } = req.body;

    if (!name || !surname || !email) {
      return res.status(400).json({ message: 'Faltan datos: name, surname y email son obligatorios' });
    }

    await authorModel.createAuthor({ name, surname, email, image });
    res.status(201).json({ message: `usuario creado: ${email}` });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ya existe un autor con ese email' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { name, surname, email, image } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Falta el email del autor a actualizar' });
    }

    const modificados = await authorModel.updateAuthor({ name, surname, email, image });

    if (modificados === 0) {
      return res.status(404).json({ message: `No existe ningún autor con el email '${email}'` });
    }

    res.status(200).json({ message: `usuario actualizado: ${email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Falta el email del autor a borrar' });
    }

    const borrados = await authorModel.deleteAuthor(email);

    if (borrados === 0) {
      return res.status(404).json({ message: `No existe ningún autor con el email '${email}'` });
    }

    res.status(200).json({ message: `Se ha borrado ${email}` });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({ message: 'No se puede borrar: este autor tiene entries asociadas' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
};