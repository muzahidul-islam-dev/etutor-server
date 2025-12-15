import express from 'express'
import { AuthController } from '../controllers/AuthController.js';
import { initializeApp } from 'firebase-admin/app';
import admin from '../config/firebaseAdmin.js';
import db from '../connection/mongodb.js';
const userRoutes = express.Router();
const UserModel = db.collection('user')
const verifyAuth = async (req, res, next) => {
    try {
        console.log(req.headers, 'this is headers')
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) return res.status(401).json({ message: "Unauthorized" })

        const existsUser = await UserModel.findOne({
            email: decodedToken?.email
        })
        if(!existsUser) return res.status(401).json({message: "Unauthorized"})

        req.user = decodedToken;
        req.userRole = existsUser?.role

        next();
    } catch (error) {
        console.error("Firebase auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

userRoutes.post('/register', AuthController.registerUser);
userRoutes.post('/login', AuthController.loginUser);
userRoutes.get('/role-check', verifyAuth, AuthController.roleCheck);
export const routes = {
    userRoutes
};