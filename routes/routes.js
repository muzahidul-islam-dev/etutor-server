import express from 'express'
import { AuthController } from '../controllers/AuthController.js';
import {verifyAuth} from '../config/verifyAuth.js';
import { StudentController } from '../controllers/StudentController.js';
import authorized from '../config/authorized.js';
import { AdminController } from '../controllers/AdminController.js';
import { PublicController } from '../controllers/PublicController.js';
const userRoutes = express.Router();
const studentRoutes = express.Router();
const adminRoutes = express.Router();
const publicRoutes = express.Router();


userRoutes.post('/register', AuthController.registerUser);
userRoutes.post('/login', AuthController.loginUser);
userRoutes.get('/role-check', verifyAuth, AuthController.roleCheck);



// Student Routes
studentRoutes.post('/tuition/create',verifyAuth, authorized('student'),StudentController.createTution);
studentRoutes.get('/tuition/all',verifyAuth, authorized('student'),StudentController.allTutions);


// Admin Routes
adminRoutes.get('/tution/all-tution-list', verifyAuth, authorized('admin'), AdminController.allTutionLists);
adminRoutes.get('/tution/all-tution-list', verifyAuth, authorized('admin'), AdminController.allTutionLists);
adminRoutes.patch('/tution/change-status', verifyAuth, authorized('admin'), AdminController.changeStatus);

// Public Routes
publicRoutes.get('/list', PublicController.tuitionLists);
publicRoutes.get('/list/:id', PublicController.singleTution);
export const routes = {
    userRoutes,
    studentRoutes,
    adminRoutes,
    publicRoutes
};