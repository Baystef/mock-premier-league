import { User } from '../models';
import { Auth } from '../utils';
import {
  conflictResponse, internalErrResponse, successResponse, unauthorizedResponse, nullResponse,
} from '../utils/response';

/**
 * @description Houses the methods for the users endpoint
 */
class userController {
  /**
  * @description Creates new user account
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async signUp(req, res) {
    const { email, password, firstName, lastName } = req.body;
    let user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    try {
      const exists = await User.findOne({ email });
      if (exists) {
        const msg = 'User already exists';
        return conflictResponse(res, msg);
      }
      user = await user.save();
      const token = user.generateToken();
      const {
        isAdmin, _id, createdAt,
      } = user;
      const data = {
        token, isAdmin, _id, firstName, lastName, email, createdAt,
      };
      req.session.key = data;
      res.setHeader('Authorization', `Bearer ${token}`);
      return successResponse(res, 201, data);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
  * @description Sign-in existing user
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async signIn(req, res) {
    const { email, password } = req.body;

    try {
      const data = await User.findOne({ email });
      if (!data) {
        const msg = 'Invalid Credentials';
        return unauthorizedResponse(res, msg);
      }
      if (!Auth.compare(password, data.password)) {
        const msg = 'Invalid Credentials';
        return unauthorizedResponse(res, msg);
      }
      const { _id, isAdmin, firstName, lastName } = data;
      const token = Auth.generateToken({ _id, isAdmin });
      const output = { token, _id, isAdmin, firstName, lastName, email };
      req.session.key = output;
      res.setHeader('Authorization', `Bearer ${token}`);
      return successResponse(res, 200, output);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
  * @description Get all users
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      if (!users[0]) {
        const msg = 'No registered users yet';
        return nullResponse(res, msg);
      }
      return successResponse(res, 200, users);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
  * @description Create admin
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async createAdmin(req, res) {
    const { email } = req.params;
    try {
      const data = await User.findOneAndUpdate({ email },
        { $set: { isAdmin: true } }, { new: true }).select('-password');
      if (!data) {
        const msg = 'User does not exist';
        return nullResponse(res, msg);
      }
      return successResponse(res, 200, data);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
 * @description Logout a user
 * @param {object} req request object
 * @param {object} res response object
 * @returns {object}  JSON response
 */
  static async logout(req, res) {
    req.session.destroy();
    const message = 'You have logged out successfully';
    return successResponse(res, 200, { message });
  }
}

export default userController;
