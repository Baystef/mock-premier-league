import '@babel/polyfill';
import { User } from '../models';
import { Auth } from '../utils';
import {
  conflictResponse, internalErrREesponse, successResponse, unauthorizedResponse, nullResponse,
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
      return successResponse(res, 201, {
        token, isAdmin, _id, firstName, lastName, email, createdAt,
      });
    } catch (error) {
      return internalErrREesponse(res);
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
      const { _id, isAdmin } = data;
      const output = { _id, isAdmin };
      const token = Auth.generateToken({ ...output });
      return successResponse(res, 200, { token, ...output });
    } catch (error) {
      return internalErrREesponse(res);
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
      return internalErrREesponse(res);
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
      return internalErrREesponse(res);
    }
  }
}

export default userController;
