import { Router } from 'express';
import { signup, login, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', authenticateToken, updateProfile);

export default router;