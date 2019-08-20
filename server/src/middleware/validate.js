import { validationResult } from 'express-validator';
import { badRequestResponse } from '../utils/response';
import { signupValidate, signinValidate, adminValidate } from './user-validate';
import {
  addTeamValidate, getTeamValidate, updateTeamValidate, deleteTeamValidate,
} from './team-validate';
import {
  addFixtureValidate, getFixtureValidate, updateFixtureValidate, deleteFixtureValidate,
} from './fixture-validate';


/**
 * @description Class of validators for each route
 */
class Validate {
  /**
   * @description Validates all fields request body
   * @param {string} route Route to be validated
   * @returns {object} error to be caught
   */
  static validate(route) {
    switch (route) {
      case 'signup':
        return signupValidate;

      case 'signin':
        return signinValidate;

      case 'createAdmin':
        return adminValidate;

      case 'addTeam':
        return addTeamValidate;

      case 'getTeam':
        return getTeamValidate;

      case 'updateTeam':
        return updateTeamValidate;

      case 'deleteTeam':
        return deleteTeamValidate;

      case 'addFixture':
        return addFixtureValidate;

      case 'getFixture':
        return getFixtureValidate;

      case 'updateFixture':
        return updateFixtureValidate;

      case 'deleteFixture':
        return deleteFixtureValidate;

      default:
        return [];
    }
  }

  /**
 * @description Resolves validation middleware
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next move to next middleware
 * @returns {object} JSON response of error
 */
  static checkValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return badRequestResponse(res, errors.array()[0].msg);
  }
}

export default Validate;
