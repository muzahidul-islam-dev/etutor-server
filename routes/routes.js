import express from 'express'
import { AuthController } from '../controllers/AuthController.js';
import { verifyAuth } from '../config/verifyAuth.js';
import { StudentController } from '../controllers/StudentController.js';
import authorized from '../config/authorized.js';
import { AdminController } from '../controllers/AdminController.js';
import { PublicController } from '../controllers/PublicController.js';
import { TutorController } from '../controllers/TutorController.js';
import { HomeController } from '../controllers/HomeController.js';
const userRoutes = express.Router();
const studentRoutes = express.Router();
const adminRoutes = express.Router();
const publicRoutes = express.Router();
const publicTutors = express.Router();
const homeRoutes = express.Router();
const tutorRoutes = express.Router();



userRoutes.post('/register', AuthController.registerUser);
userRoutes.post('/login', AuthController.loginUser);
userRoutes.get('/role-check', verifyAuth, AuthController.roleCheck);



// Student Routes
studentRoutes.post('/tuition/create', verifyAuth, authorized('student'), StudentController.createTution);
studentRoutes.get('/tuition/all', verifyAuth, authorized('student'), StudentController.allTutions);
studentRoutes.get('/applied-tutors', verifyAuth, authorized('student'), StudentController.appliedTutors);
studentRoutes.get('/applied-tutors-by-tuition/:id', verifyAuth, authorized('student'), StudentController.appliedTutorsByTuition);
studentRoutes.get('/payment/:id', verifyAuth, authorized('student'), StudentController.studentPayment);
studentRoutes.patch('/payment/:id', StudentController.paymentVerify);
studentRoutes.get('/payment-history', verifyAuth, authorized('student'), StudentController.paymentHistory);


// Admin Routes
adminRoutes.get('/tution/all-tution-list', verifyAuth, authorized('admin'), AdminController.allTutionLists);
adminRoutes.get('/tution/all-tution-list', verifyAuth, authorized('admin'), AdminController.allTutionLists);
adminRoutes.patch('/tution/change-status', verifyAuth, authorized('admin'), AdminController.changeStatus);
adminRoutes.get('/users', verifyAuth, authorized('admin'), AdminController.users)
adminRoutes.patch('/user/update/:id', verifyAuth, authorized('admin'), AdminController.updateUser)
adminRoutes.delete('/user/delete/:id', verifyAuth, authorized('admin'), AdminController.deleteUser)
adminRoutes.get('/revenew', verifyAuth, authorized('admin'), AdminController.revenewHistory);
// Tutor Routes
tutorRoutes.post('/apply', verifyAuth, authorized('tutor'), TutorController.applyTuition)
tutorRoutes.get('/my-applications', verifyAuth, authorized('tutor'), TutorController.myApplications);
tutorRoutes.patch('/my-applications/update/:id', verifyAuth, authorized('tutor'), TutorController.updateApplication);
tutorRoutes.get('/my-applications/edit/:id', verifyAuth, authorized('tutor'), TutorController.editApplication);
tutorRoutes.delete('/my-applications/delete/:id', verifyAuth, authorized('tutor'), TutorController.deleteApplication);
tutorRoutes.get('/ongoing', verifyAuth, authorized('tutor'), TutorController.onGoing);
tutorRoutes.get('/revenew', verifyAuth, authorized('tutor'), TutorController.revenewHistory);
// Public Routes
publicRoutes.get('/list', PublicController.tuitionLists);
publicRoutes.get('/list/:id', PublicController.singleTution);
publicTutors.get('/list', TutorController.allTutors)
publicTutors.get('/list/:id', TutorController.singleTutor)
homeRoutes.get('/tutions', HomeController.tutionsLists);
homeRoutes.get('/tutors', HomeController.tutorLists);


export const routes = {
    userRoutes,
    studentRoutes,
    adminRoutes,
    publicRoutes,
    publicTutors,
    homeRoutes,
    tutorRoutes
};