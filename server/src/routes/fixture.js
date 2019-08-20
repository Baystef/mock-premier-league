import { Router } from 'express';
import { Fixtures } from '../controllers';
import Authorization from '../middleware/authorization';
import Validate from '../middleware/validate';

const router = Router();

const {
  addFixture, getFixture, updateFixture, deleteFixture, playFixture,
} = Fixtures;
const { verifyUser, verifyAdmin } = Authorization;
const { validate, checkValidationResult } = Validate;

// Add new fixture
router.post('/', verifyAdmin, validate('addFixture'), checkValidationResult, addFixture);

// Get fixture
router.get('/', verifyUser, validate('getFixture'), checkValidationResult, getFixture);

// Play fixture
router.patch('/play/:fixtureLink', verifyAdmin, playFixture);

// Update a fixture
router.put('/:fixtureLink', verifyAdmin, validate('updateFixture'), checkValidationResult, updateFixture);

// Delete a fixture
router.delete('/:fixtureLink', verifyAdmin, validate('deleteFixture'), checkValidationResult, deleteFixture);

export default router;
