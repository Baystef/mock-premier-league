import '@babel/polyfill';
import { Team } from '../models';
import {
  conflictResponse, internalErrREesponse, successResponse, nullResponse,
} from '../utils/response';
import { getByTeamName, getByCoach } from '../utils';

/**
 * @description Houses the methods for the teams endpoint
 */
class teamController {
  /**
   * @description Creates new team
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object}  JSON response
   */
  static async addTeam(req, res) {
    const { teamName, noOfPlayers, coach } = req.body;

    let team = new Team({
      teamName,
      noOfPlayers,
      coach,
    });

    try {
      const exists = await Team.findOne({ teamName });
      if (exists) {
        const msg = 'Team already exists';
        return conflictResponse(res, msg);
      }
      team = await team.save();
      return successResponse(res, 201, team);
    } catch (error) {
      return internalErrREesponse(res);
    }
  }

  /**
  * @description Get team(s)
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async getTeam(req, res) {
    try {
      const { teamName, coach } = req.query;

      switch (false) {
        case !teamName: {
          return getByTeamName(res, Team, teamName);
        }

        case !coach: {
          return getByCoach(res, Team, coach);
        }

        default: {
          const team = await Team.find();
          if (!team[0]) {
            const msg = 'No teams exist';
            return nullResponse(res, msg);
          }
          return successResponse(res, 200, team);
        }
      }
    } catch (error) {
      return internalErrREesponse(res);
    }
  }

  /**
  * @description Update a team
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async updateTeam(req, res) {
    const { teamName } = req.params;
    try {
      const data = await Team.findOneAndUpdate({ teamName }, req.body, { new: true });
      if (!data) {
        const msg = 'Team does not exist';
        return nullResponse(res, msg);
      }
      return successResponse(res, 200, data);
    } catch (error) {
      return internalErrREesponse(res);
    }
  }

  /**
   * @description Delete a team
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object}  JSON response
   */
  static async deleteTeam(req, res) {
    const { teamName } = req.params;
    try {
      const data = await Team.findOneAndDelete({ teamName });
      if (!data) {
        const msg = 'Team does not exist';
        return nullResponse(res, msg);
      }
      const message = `${teamName} has been deleted successfully`;
      return successResponse(res, 200, { message });
    } catch (error) {
      return internalErrREesponse(res);
    }
  }
}

export default teamController;
