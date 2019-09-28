import { Router } from 'express';
import { Fixtures } from '../controllers';
import Authorization from '../middleware/authorization';
import authentication from '../middleware/authentication';
import Validate from '../middleware/validate';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

const {
  addFixture, getFixture, updateFixture, deleteFixture, playFixture,
} = Fixtures;
const { verifyUser, verifyAdmin } = Authorization;
const { validate, checkValidationResult } = Validate;

// Add new fixture
router.post('/', authentication, verifyAdmin, validate('addFixture'), checkValidationResult, addFixture);

// Get fixture
router.get('/', authentication, verifyUser, validate('getFixture'), checkValidationResult, rateLimiter, getFixture);

// Play fixture
router.patch('/play/:fixtureLink', authentication, verifyAdmin, playFixture);

// Update a fixture
router.put('/:fixtureLink', authentication, verifyAdmin, validate('updateFixture'), checkValidationResult, updateFixture);

// Delete a fixture
router.delete('/:fixtureLink', authentication, verifyAdmin, validate('deleteFixture'), checkValidationResult, deleteFixture);

export default router;
