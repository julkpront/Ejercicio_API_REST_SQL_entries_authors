const pool = require('../config/db_pgsql');
const queries = require('../queries/author.queries');

const getAllAuthors = async () => {
  const result = await pool.query(queries.getAllAuthors);
  return result.rows;
};

const getAuthorByEmail = async (email) => {
  const result = await pool.query(queries.getAuthorByEmail, [email]);
  return result.rows;
};

const createAuthor = async (author) => {
  const { name, surname, email, image } = author;
  const result = await pool.query(queries.createAuthor, [name, surname, email, image]);
  return result.rowCount;
};

const updateAuthor = async (author) => {
  const { name, surname, email, image } = author;
  const result = await pool.query(queries.updateAuthor, [email, name, surname, image]);
  return result.rowCount;
};

const deleteAuthor = async (email) => {
  const result = await pool.query(queries.deleteAuthor, [email]);
  return result.rowCount;
};

module.exports = {
  getAllAuthors,
  getAuthorByEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor
};