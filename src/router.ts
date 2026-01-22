import { Router } from 'express';
import { handleInputErrors } from './middlewares/validation';
import { body } from 'express-validator';
import { registerUser } from './services/user';

const router = Router();

router.post(
    '/auth/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('lastname').notEmpty().withMessage('Lastname is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({min: 4}).withMessage('Password should be at least 4 characters long'),
    ],
    handleInputErrors,
    registerUser
);

export default router;


