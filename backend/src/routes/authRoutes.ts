import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();


router.post('/signup', authController.signupUser as any);
router.post('/admin-signup', authController.signupAdmin as any);
router.post('/login', authController.login as any);
export default router;
