import { rateLimiter } from '../utils';

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const { ip, user: { _id } } = req;
    const key = _id || ip;
    const pointsToConsume = _id ? 1 : 30;
    await rateLimiter.consume(key, pointsToConsume);
    next();
  } catch (error) {
    res.status(429).json({
      status: 'error',
      error: 'Too many Requests, Please try again later',
    });
  }
};

export default rateLimiterMiddleware;
