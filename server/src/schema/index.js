import { Team, User, Fixture } from '../models';
import users from './user.seeder';
import teams from './team.seeder';
import fixtures from './fixture.seeder';

const modelArray = [User, Team, Fixture];

const populate = (Model, seeds) => {
  seeds.forEach((seed) => {
    const newModel = new Model(seed);
    newModel.save();
  });
};

const erase = async (Model) => {
  await Model.deleteMany({});
};

const unseed = async () => {
  try {
    console.log('Clearing database...');
    return await Promise.all(modelArray.map((m) => erase(m)));
  } catch (error) {
    console.log(error.message);
  }
};

const seed = async () => {
  try {
    await populate(User, users);
    await populate(Team, teams);
    await populate(Fixture, fixtures);
    console.log('Database seeded!');
  } catch (error) {
    console.log(error.message);
  }
};

export { seed, unseed };
