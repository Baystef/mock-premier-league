import { nullResponse, successResponse } from './response';

const getByTeamName = async (res, Team, teamName) => {
  const team = await Team.find({ teamName });
  if (!team[0]) {
    const msg = 'Team does not exist';
    return nullResponse(res, msg);
  }
  return successResponse(res, 200, team);
};

const getByCoach = async (res, Team, coach) => {
  const team = await Team.find({ coach });
  if (!team[0]) {
    const msg = 'Team with that coach does not exist';
    return nullResponse(res, msg);
  }
  return successResponse(res, 200, team);
};

export { getByTeamName, getByCoach };
