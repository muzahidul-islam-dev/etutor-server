import db from '../connection/mongodb.js';
import admin from './firebaseAdmin.js'
const UserModel = db.collection('user')
const verifyAuth = async (req, res, next) => {
    try {
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
export default verifyAuth