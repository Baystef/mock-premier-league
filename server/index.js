import mongoose from 'mongoose';
import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import routes from './src/routes';
import { log } from './src/utils';

const app = express();
config();

const env = process.env.NODE_ENV;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

if (env === 'test') {
  mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true })
    .then(() => log('Connected to MongoDB...'))
    .catch((err) => log(err.message));
} else {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log(err.message));
}

app.use(morgan('dev'));
app.use(express.json());

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

const port = process.env.PORT || 4600;

app.listen(port, () => log(`App is listening on port: ${port}`));

export default app;
