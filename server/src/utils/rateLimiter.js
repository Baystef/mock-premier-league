import { RateLimiterRedis } from 'rate-limiter-flexible';
import client from './redis';

/**
 * Here lies the rate limiter configuration,
 * points is the maximum number of requests allowed per duration(seconds)
 * Therefore this config translates to 600 requests/60 seconds
 */
const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  points: 600,
  duration: 60
});

export default rateLimiter;
