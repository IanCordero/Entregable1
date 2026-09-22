require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const tasksRouter = require('./routes/tasks');

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '200kb' }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
      return callback(new Error('Origen no autorizado por CORS.'));
    },
  }),
);

app.get('/', (_req, res) => res.json({ message: 'TaskFlow API está funcionando.' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'taskflow-api' }));
app.use('/api/tasks', tasksRouter);

app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.message.includes('CORS') ? 403 : 500).json({ message: error.message || 'Error interno del servidor.' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`TaskFlow API disponible en http://localhost:${port}`));
}

module.exports = app;
