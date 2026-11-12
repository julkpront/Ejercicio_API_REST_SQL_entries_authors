const pool = require('../config/db_pgsql');
const queries = require('../queries/entries.queries');

const getAllEntries = async () => {
  const result = await pool.query(queries.getAllEntries);
  return result.rows;
};

const getEntriesByEmail = async (email) => {
  const result = await pool.query(queries.getEntriesByEmail, [email]);
  return result.rows;
};

const createEntry = async (entry) => {
  const { title, content, email, category } = entry;
  const result = await pool.query(queries.createEntry, [title, content, email, category]);
  return result.rowCount;
};

const updateEntry = async (entry) => {
  const { title, content, email, category } = entry;
  const result = await pool.query(queries.updateEntry, [title, content, email, category]);
  return result.rowCount;
};

const deleteEntry = async (title) => {
  const result = await pool.query(queries.deleteEntry, [title]);
  return result.rowCount;
};

module.exports = {
  getAllEntries,
  getEntriesByEmail,
  createEntry,
  updateEntry,
  deleteEntry
};