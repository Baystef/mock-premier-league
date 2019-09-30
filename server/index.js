import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { config } from 'dotenv';
import morgan from 'morgan';
import { client } from './src/utils';
import routes from './src/routes';

config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const redisStore = connectRedis(session);

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: '_redisSession',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new redisStore({ client, ttl: 86400 }),
}));

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Mock Premier League',
  });
});

// Error handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status((err.status >= 100 && err.status < 600) ? err.status : 500).json({
    status: 'error',
    error: 'Invalid request',
  });
});


export default app;
