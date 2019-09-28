import { unauthorizedResponse } from '../utils/response';

/**
  * @description Verifies if user is logged in
  * @param {object} req request object
  * @param {object} res response object
  * @param {function} next continue to next method
  * @returns {boolean} returns true or false for admin verification
  */
const authentication = (req, res, next) => {
  if (!req.session || !req.session.key) {
    return unauthorizedResponse(res, 'Please login to access this resource');
  }
  return next();
};

export default authentication;
