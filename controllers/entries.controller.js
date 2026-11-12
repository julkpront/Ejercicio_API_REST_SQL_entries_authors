const entryModel = require('../models/entries.model');

const getEntries = async (req, res) => {
  try {
    const { email } = req.query;
    let entries;

    if (email) {
      entries = await entryModel.getEntriesByEmail(email);
    } else {
      entries = await entryModel.getAllEntries();
    }

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createEntry = async (req, res) => {
  try {
    const { title, content, email, category } = req.body;

    if (!title || !content || !email) {
      return res.status(400).json({ message: 'Faltan datos: title, content y email son obligatorios' });
    }

    await entryModel.createEntry({ title, content, email, category });
    res.status(201).json({ message: `Se ha creado la entry '${title}'` });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ya existe una entry con ese título' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateEntry = async (req, res) => {
  try {
    const { title, content, email, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Falta el título de la entry a modificar' });
    }

    const modificadas = await entryModel.updateEntry({ title, content, email, category });

    if (modificadas === 0) {
      return res.status(404).json({ message: `No existe ninguna entry con el título '${title}'` });
    }

    res.status(200).json({ message: `Se ha modificado la entry '${title}'` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Falta el título de la entry a borrar' });
    }

    const borradas = await entryModel.deleteEntry(title);

    if (borradas === 0) {
      return res.status(404).json({ message: `No existe ninguna entry con el título '${title}'` });
    }

    res.status(200).json({ message: `Se ha borrado la entry '${title}'` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry
};