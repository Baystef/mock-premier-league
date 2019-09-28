import { seed, unseed } from '../src/schema';
import { db, dbDisconnect } from '../db';

/**
   * @description Object of helper methods that initialize and clear the
   * database before and after every test
   */
const testDB = {
  start: async (name) => {
    await db(name);
    await unseed();
    await seed();
  },

  stop: async () => {
    await dbDisconnect();
    await unseed();
  },
};

export default testDB;
