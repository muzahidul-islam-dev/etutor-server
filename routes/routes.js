import express from 'express'
import { AuthController } from '../controllers/AuthController.js';

const userRoutes = express.Router();


userRoutes.post('/register', AuthController.registerUser);
export const routes = {
    userRoutes
};