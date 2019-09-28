import { Router } from 'express';
import { Users } from '../controllers';
import Authorization from '../middleware/authorization';
import authentication from '../middleware/authentication';
import Validate from '../middleware/validate';

const router = Router();

const { signUp, signIn, getUsers, createAdmin, logout } = Users;
const { verifyAdmin } = Authorization;
const { validate, checkValidationResult } = Validate;

// New user signup
router.post('/signup', validate('signup'), checkValidationResult, signUp);

// User signin
router.post('/signin', validate('signin'), checkValidationResult, signIn);

// User logout
router.post('/logout', authentication, logout);

// Get all users
router.get('/', authentication, verifyAdmin, getUsers);

// Create Admin
router.patch('/admin/:email', authentication, verifyAdmin, validate('createAdmin'), checkValidationResult, createAdmin);

export default router;
