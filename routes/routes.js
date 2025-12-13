import express from 'express'
import { AuthController } from '../controllers/AuthController.js';

const userRoutes = express.Router();


userRoutes.post('/register', AuthController.registerUser);
userRoutes.get('/role-check', AuthController.roleCheck);
export const routes = {
    userRoutes
};