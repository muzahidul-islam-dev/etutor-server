import express from 'express'
import { AuthController } from '../controllers/AuthController.js';
import verifyAuth from '../config/verifyAuth.js';
const userRoutes = express.Router();
const studentRoutes = express.Router();


userRoutes.post('/register', AuthController.registerUser);
userRoutes.post('/login', AuthController.loginUser);
userRoutes.get('/role-check', verifyAuth, AuthController.roleCheck);



// Student Routes
studentRoutes.post('/tution/create',() => {});
export const routes = {
    userRoutes
};