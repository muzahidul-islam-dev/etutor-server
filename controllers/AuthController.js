import db from "../connection/mongodb.js"
const UserModel = db.collection('user')

const registerUser = async (req, res) => {
    try {
        const data = req.body;
        const existUser = await UserModel.findOne({
            email: data?.email
        })
        if(existUser){
            return res.status(200).json({
                success: false,
                message: "User allready exists"
            })
        }
        await UserModel.insertOne(data);
        res.status(200).json({
            success: true,
            message: 'User registration successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const AuthController = {
    registerUser
}