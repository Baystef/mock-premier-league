/* eslint-disable require-jsdoc */
import { createClient } from 'redis';

const {
  PASSWORD: password,
  REDIS_HOST: host,
  REDIS_PORT: port,
} = process.env;

const client = createClient(port, host, { no_ready_check: true, enableOfflineQueue: false });
if (password) {
  client.auth(password, (err) => {
    if (err) throw err;
  });
}

client.on('connect', () => console.log('connected to Redis'));

client.on('error', (err) => {
  console.log('Redis Error:', err);
});


export async function closeInstance() {
  console.log('Closing redis connection...');
  await new Promise((resolve) => {
    client.quit(() => {
      resolve();
    });
  });
  await new Promise((resolve) => setImmediate(resolve));
  console.log('Redis connection closed');
}

export default client;
