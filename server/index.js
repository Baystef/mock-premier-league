import express from 'express';
import session from 'express-session';
// import Redis from 'ioredis';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';
import { config } from 'dotenv';
import morgan from 'morgan';
import routes from './src/routes';

config();

const {
  PASSWORD: password,
  REDIS_HOST: host,
  REDIS_PORT: port,
} = process.env;


const app = express();

app.use(morgan('dev'));
app.use(express.json());

// const redis = new Redis(port, host, { no_ready_check: true });
const client = createClient(port, host, { no_ready_check: true });
client.auth(password, (err) => {
  if (err) throw err;
});

const redisStore = connectRedis(session);

client.on('connect', () => console.log('connected to Redis'));

client.on('error', (err) => {
  console.log('Redis Error:', err);
});

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
