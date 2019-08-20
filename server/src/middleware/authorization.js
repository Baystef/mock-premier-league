import { Auth } from '../utils';
import {
  unauthorizedResponse, forbiddenResponse,
} from '../utils/response';

const { verifyToken } = Auth;

/**
 * @description User Authorization
 * @exports Authorization
 */
class Authorization {
  /**
   * @description Verifies if user is admin and has a valid token
   * to access admin resources
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next continue to next method
   * @returns {boolean} returns true or false for admin verification
   */
  static verifyAdmin(req, res, next) {
    try {
      const token = req.get('Authorization').replace('Bearer ', '');
      if (!token) return unauthorizedResponse(res, 'No token provided');
      const decoded = verifyToken(token);
      const { isAdmin } = decoded;
      if (!isAdmin) {
        return forbiddenResponse(res, 'Access Denied');
      }
      return next();
    } catch (error) {
      return unauthorizedResponse(res, 'Invalid token');
    }
  }

  /**
   * @description Verifies if user is signed in and has a valid token
   * to access user resources
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next continue to next method
   * @returns {boolean} returns true or false for user verification
   */
  static verifyUser(req, res, next) {
    try {
      const token = req.get('Authorization').replace('Bearer ', '');
      if (!token) return unauthorizedResponse(res, 'No token provided');
      const decoded = verifyToken(token);
      req.user = decoded;
      if (!req.user._id) {
        return forbiddenResponse(res, 'Access Denied');
      }
      return next();
    } catch (error) {
      return unauthorizedResponse(res, 'Invalid token');
    }
  }
}

export default Authorization;
