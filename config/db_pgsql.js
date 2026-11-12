const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

module.exports = pool;

// require('pg'): trae la librería que sabe hablar con PostgreSQL. 

// Pool es una “piscina” de conexiones:
// en vez de abrir y cerrar una conexión por cada petición,
// mantiene varias abiertas y las reparte.

// require('dotenv').config(): lee tu archivo .env y carga sus valores en process.env.
// Va antes del new Pool, porque si no, los valores estarían vacíos.

// process.env.DB_HOST…: lee cada dato del .env. Así la contraseña no aparece en el código.

// module.exports = pool: deja el pool disponible para que otros archivos lo importen con require.
// Es la parte que pide el enunciado:
// Los modelos solo tendrán que hacer const pool = require('../config/db_pgsql').