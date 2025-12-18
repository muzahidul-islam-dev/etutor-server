import { ObjectId } from "mongodb";
import db from "../connection/mongodb.js"

const TutionModel = db.collection('tutions');
const UserModel = db.collection('users')

const allTutionLists = async (req, res) => {
    try {
        const results = await TutionModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'email',
                    foreignField: 'email',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]).toArray();
        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const changeStatus = async (req, res) => {
    try {
        const data = req.body;
        const tutionId = data?.id;
        const tutionExists = TutionModel.findOne({
            _id: new ObjectId(tutionId)
        });
        if (!tutionExists) return res.status(200).json({
            success: false,
            message: 'Tution not found.'
        });

        await TutionModel.updateOne(
            {
                _id: new ObjectId(tutionId)
            },
            {
                $set: {
                    status: data?.status
                }
            }
        );
        return res.status(200).json({
            success: true,
            message: 'Status update'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const users = async (req, res) => {
    try {
        const data = await UserModel.find({
            email: {$ne: req.user.email}
        }).toArray();
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const { role } = req.body;
        await UserModel.updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: {
                    role: role
                }
            }
        )
        return res.status(200).json({
            success: true,
            message: 'User update successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        await UserModel.deleteOne({
            _id: new ObjectId(req.params.id)
        })
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


export const AdminController = {
    allTutionLists,
    changeStatus,
    users,
    updateUser,
    deleteUser
}