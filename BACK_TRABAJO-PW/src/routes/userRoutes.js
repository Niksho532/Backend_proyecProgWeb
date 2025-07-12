import express from 'express';
import UserController from '../controllers/userController.js';
const router = express.Router();
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/reset-password', UserController.resetPassword);
router.put('/:id', UserController.updateUser);
export default router;

