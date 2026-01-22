import { Router } from 'express';
import { handleInputErrors } from './middlewares/validation';
import { body } from 'express-validator';
import { loginUser, registerUser } from './services/user';

const router = Router();

router.post(
    '/auth/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('lastname').notEmpty().withMessage('Lastname is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({min: 4}).withMessage('Password isn\'t long enough'),
    ],
    handleInputErrors,
    registerUser
);

router.post(
    '/auth/login',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    handleInputErrors,
    loginUser
)

export default router;


