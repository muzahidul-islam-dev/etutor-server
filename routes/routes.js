import express from 'express'
import { AuthController } from '../controllers/AuthController.js';
import {verifyAuth} from '../config/verifyAuth.js';
import { StudentController } from '../controllers/StudentController.js';
import authorized from '../config/authorized.js';
const userRoutes = express.Router();
const studentRoutes = express.Router();


userRoutes.post('/register', AuthController.registerUser);
userRoutes.post('/login', AuthController.loginUser);
userRoutes.get('/role-check', verifyAuth, AuthController.roleCheck);



// Student Routes
studentRoutes.post('/tuition/create',verifyAuth, authorized('student'),StudentController.createTution);
studentRoutes.get('/tuition/all',verifyAuth, authorized('student'),StudentController.allTutions);
export const routes = {
    userRoutes,
    studentRoutes
};