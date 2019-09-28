import moment from 'moment';
import { Fixture } from '../models';
import {
  conflictResponse, internalErrResponse, successResponse, nullResponse, badRequestResponse,
} from '../utils/response';

/**
 * @description Houses the methods for the teams endpoint
 */
class fixtureController {
  /**
   * @description Creates new fixture
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object}  JSON response
   */
  static async addFixture(req, res) {
    const { homeTeam, awayTeam, fixtureDate } = req.body;

    let fixture = new Fixture({
      homeTeam,
      awayTeam,
      fixtureDate,
    });

    try {
      const exists = await Fixture.find({ homeTeam, awayTeam });
      if (exists[0]) {
        const msg = 'Fixture already exists';
        return conflictResponse(res, msg);
      }
      if (moment(fixtureDate).diff(moment(0, 'HH'), 'day') < 0) {
        return badRequestResponse(res, 'You cannot create a fixture in the past');
      }
      fixture = await fixture.save();
      return successResponse(res, 201, fixture);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
  * @description Get fixture(s)
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async getFixture(req, res) {
    const { fixtureLink, status } = req.query;
    try {
      switch (false) {
        case !fixtureLink: {
          const fixture = await Fixture.findOne({ fixtureLink });
          if (!fixture) {
            const msg = 'Fixture does not exist';
            return nullResponse(res, msg);
          }
          return successResponse(res, 200, fixture);
        }

        case !status: {
          const fixture = await Fixture.find({ status });
          if (!fixture[0]) {
            const msg = `No ${status} fixtures`;
            return nullResponse(res, msg);
          }
          return successResponse(res, 200, fixture);
        }

        default: {
          const fixture = await Fixture.find();
          if (!fixture[0]) {
            const msg = 'No fixtures exist yet';
            return nullResponse(res, msg);
          }
          return successResponse(res, 200, fixture);
        }
      }
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
  * @description Update a fixture
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async updateFixture(req, res) {
    const { fixtureLink } = req.params;
    try {
      const fixture = await Fixture.findOneAndUpdate({ fixtureLink }, req.body, { new: true });
      if (!fixture) {
        const msg = 'Fixture does not exist';
        return nullResponse(res, msg);
      }
      return successResponse(res, 200, fixture);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
  * @description Play fixture
  * @param {object} req request object
  * @param {object} res response object
  * @returns {object}  JSON response
  */
  static async playFixture(req, res) {
    const { fixtureLink } = req.params;
    try {
      const fixture = await Fixture.findOneAndUpdate({ fixtureLink },
        { $set: { status: 'completed' } }, { new: true });
      if (!fixture) {
        const msg = 'Fixture does not exist';
        return nullResponse(res, msg);
      }
      return successResponse(res, 200, fixture);
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
   * @description Delete a fixture
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object}  JSON response
   */
  static async deleteFixture(req, res) {
    const { fixtureLink } = req.params;
    try {
      const fixture = await Fixture.findOneAndDelete({ fixtureLink });
      if (!fixture) {
        const msg = 'Fixture does not exist';
        return nullResponse(res, msg);
      }
      const message = 'Fixture has been deleted successfully';
      return successResponse(res, 200, { message });
    } catch (error) {
      return internalErrResponse(res);
    }
  }

  /**
   * @description Robustly search for a fixture or team
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object}  JSON response
   */
  static async search(req, res) {
    const { term } = req.query;
    try {
      const searched = await Fixture.find({
        $text: { $search: term }
      });
      if (!searched[0]) {
        const msg = `No result found for ${term}`;
        return nullResponse(res, msg);
      }
      return successResponse(res, 200, searched);
    } catch (error) {
      return internalErrResponse(res, error.message);
    }
  }
}

export default fixtureController;
