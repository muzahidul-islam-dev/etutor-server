import db from '../connection/mongodb.js';
import admin from './firebaseAdmin.js'
const UserModel = db.collection('users')
export const verifyAuth = async (req, res, next) => {
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
        if (!existsUser) return res.status(401).json({ message: "User not exists" })

        req.user = decodedToken;
        req.userRole = existsUser?.role

        next();
    } catch (error) {
        console.error("Firebase auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const verifyStudentAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) return res.status(403).json({ message: "Unauthorized" })

        const existsUser = await UserModel.findOne({
            email: decodedToken?.email
        })
        if (!existsUser) return res.status(403).json({ message: "Unauthorized" })

        if (existsUser?.role != 'student') return res.status(403).json({ message: "Unauthorized" })

        req.user = decodedToken;
        req.userRole = existsUser?.role

        next();
    } catch (error) {
        console.error("Firebase auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const verifyAdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) return res.status(403).json({ message: "Unauthorized" })

        const existsUser = await UserModel.findOne({
            email: decodedToken?.email
        })
        if (!existsUser) return res.status(403).json({ message: "Unauthorized" })

        if (existsUser?.role != 'admin') return res.status(403).json({ message: "Unauthorized" })

        req.user = decodedToken;
        req.userRole = existsUser?.role

        next();
    } catch (error) {
        console.error("Firebase auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const verifyTutorAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) return res.status(403).json({ message: "Unauthorized" })

        const existsUser = await UserModel.findOne({
            email: decodedToken?.email
        })
        if (!existsUser) return res.status(403).json({ message: "Unauthorized" })

        if (existsUser?.role != 'tutor') return res.status(403).json({ message: "Unauthorized" })

        req.user = decodedToken;
        req.userRole = existsUser?.role

        next();
    } catch (error) {
        console.error("Firebase auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}