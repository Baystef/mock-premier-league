import { seed, unseed } from '../src/schema';
import { db, dbDisconnect } from '../db';
import { closeInstance } from '../src/utils/redis';

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
    await closeInstance();
  },
};

export default testDB;
