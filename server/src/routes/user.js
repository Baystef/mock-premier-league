import { Router } from 'express';
import { Users } from '../controllers';
import Authorization from '../middleware/authorization';
import Validate from '../middleware/validate';

const router = Router();

const { signUp, signIn, getUsers, createAdmin } = Users;
const { verifyAdmin } = Authorization;
const { validate, checkValidationResult } = Validate;

// New user signup
router.post('/signup', validate('signup'), checkValidationResult, signUp);

// User signin
router.post('/signin', validate('signin'), checkValidationResult, signIn);

// Get all users
router.get('/', verifyAdmin, getUsers);

// Create Admin
router.patch('/admin/:email', verifyAdmin, validate('createAdmin'), checkValidationResult, createAdmin);

export default router;
