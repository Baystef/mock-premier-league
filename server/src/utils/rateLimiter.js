import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

/**
 * Here lies the rate limiter configuration,
 * points is the maximum number of requests allowed per duration(seconds)
 * Therefore this config translates to 600 requests/60 seconds
 */
const rateLimitClient = new Redis({ enableOfflineQueue: false });
const rateLimiter = new RateLimiterRedis({
  storeClient: rateLimitClient,
  points: 600,
  duration: 60
});

export default rateLimiter;
