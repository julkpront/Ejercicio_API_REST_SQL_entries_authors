const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const entriesRoutes = require('./routes/entries.routes');
const authorsRoutes = require('./routes/authors.routes');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,//informan de cuántas peticiones le quedan al cliente.
  legacyHeaders: false,//desactiva las cabeceras antiguas, que ya no se usan
  message: { message: 'Demasiadas peticiones, inténtalo de nuevo en un minuto' }
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json());

app.use('/api/entries', entriesRoutes);
app.use('/api/authors', authorsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// npm start

// http://localhost:3000/api/entries → debería mostrar las 5 entries en JSON.
// http://localhost:3000/api/entries?email=birja@thebridgeschool.es → solo las 2 noticias de Birja, con datos del autor y sin id_entry.