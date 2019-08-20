import mongoose from 'mongoose';
import { Team, User, Fixture } from '../models';
import users from './user.seeder';
import teams from './team.seeder';
import fixtures from './fixture.seeder';
import { log } from '../utils';

const env = process.env.NODE_ENV;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
if (env === 'test') {
  mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true })
    .then(() => log('Connected to MongoDB...'))
    .catch((err) => log(err.message));
} else {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => log('Connected to MongoDB...'))
    .catch((err) => log(err.message));
}


const populate = (Model, seeds) => {
  Model.remove({}, () => {
    seeds.forEach((seed) => {
      const newModel = new Model(seed);
      newModel.save();
    });
  });
};

const seed = async () => {
  try {
    await populate(User, users);
    await populate(Team, teams);
    await populate(Fixture, fixtures);
    log('Database seeded!');
  } catch (error) {
    log(error.message);
  }
};

export default seed;

seed();
