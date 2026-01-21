import { Router } from 'express';
import { registerUser } from './repositories/auth';

const router = Router();

router.post(
    '/auth/register',
    registerUser
);

export default router;


