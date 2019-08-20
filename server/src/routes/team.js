import { Router } from 'express';
import { Teams } from '../controllers';
import Authorization from '../middleware/authorization';
import Validate from '../middleware/validate';

const router = Router();

const { addTeam, getTeam, deleteTeam, updateTeam } = Teams;
const { verifyUser, verifyAdmin } = Authorization;
const { validate, checkValidationResult } = Validate;

// Add new team
router.post('/', verifyAdmin, validate('addTeam'), checkValidationResult, addTeam);

// Get team
router.get('/', verifyUser, validate('getTeam'), checkValidationResult, getTeam);

// Update a team
router.put('/:teamName', verifyAdmin, validate('updateTeam'), checkValidationResult, updateTeam);

// Delete a team
router.delete('/:teamName', verifyAdmin, validate('deleteTeam'), checkValidationResult, deleteTeam);

export default router;
