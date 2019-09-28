import { Router } from 'express';
import user from './user';
import team from './team';
import fixture from './fixture';
import search from './search';

const routes = Router();

routes.use('/users', user);
routes.use('/teams', team);
routes.use('/fixtures', fixture);
routes.use('/search', search);


export default routes;
