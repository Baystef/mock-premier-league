import { Router } from 'express';
import { Teams } from '../controllers';
import Authorization from '../middleware/authorization';
import authentication from '../middleware/authentication';
import Validate from '../middleware/validate';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

const { addTeam, getTeam, deleteTeam, updateTeam } = Teams;
const { verifyUser, verifyAdmin } = Authorization;
const { validate, checkValidationResult } = Validate;

// Add new team
router.post('/', authentication, verifyAdmin, validate('addTeam'), checkValidationResult, addTeam);

// Get team
router.get('/', authentication, verifyUser, validate('getTeam'), checkValidationResult, rateLimiter, getTeam);

// Update a team
router.put('/:teamName', authentication, verifyAdmin, validate('updateTeam'), checkValidationResult, updateTeam);

// Delete a team
router.delete('/:teamName', authentication, verifyAdmin, validate('deleteTeam'), checkValidationResult, deleteTeam);

export default router;
