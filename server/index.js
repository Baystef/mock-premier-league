import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { config } from 'dotenv';
import morgan from 'morgan';
import routes from './src/routes';

config();

const redisClient = process.env.REDIS_URI;

const app = express();
const redis = new Redis(redisClient);
const redisStore = connectRedis(session);

app.use(morgan('dev'));
app.use(express.json());


redis.on('error', (err) => {
  console.log('Redis Error:', err);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: '_redisSession',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new redisStore({ client: redis, ttl: 86400 }),
}));

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Mock Premier League',
  });
});


app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  res.status((err.status >= 100 && err.status < 600) ? err.status : 500).json({
    status: 'error',
    error: 'Invalid request',
  });
});


export default app;
