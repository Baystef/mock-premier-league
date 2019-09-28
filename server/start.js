import app from './index';
import { log } from './src/utils';
import { db } from './db';

const port = process.env.PORT || 4600;

db();
app.listen(port, () => log(`App is listening on port: ${port}`));
