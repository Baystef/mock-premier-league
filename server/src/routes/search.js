import { Router } from 'express';
import { Fixtures } from '../controllers';

const router = Router();
const { search } = Fixtures;

// Robust Search
router.get('/', search);

export default router;
