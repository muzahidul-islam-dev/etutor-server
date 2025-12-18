import { ObjectId } from "mongodb";
import db from "../connection/mongodb.js";

const UserModel = db.collection('users');
const ApplyModel = db.collection('applies')
const allTutors = async (req, res) => {
    try {
        const tutors = await UserModel.find({
            role: 'tutor'
        }).toArray();
        return res.status(200).json({
            success: true,
            data: tutors
        })
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const singleTutor = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await UserModel.findOne({
            _id: new ObjectId(id)
        });
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const applyTuition = async (req, res) => {
    try {
        const requestData = req.body;
        const data = {
            tuition_id: new ObjectId(requestData.tuition_id),
            qualifications: requestData.qualifications,
            experience: requestData.experience,
            salary: requestData.salary,
            user: req.user?.email,
            status: 'pending',
            createdAt: new Date()
        }
        await ApplyModel.insertOne(data);
        res.status(200).json({
            success: true,
            message: 'Application successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const myApplications = async (req, res) => {
    try {
        const data = await ApplyModel.aggregate([
            {
                $match: {
                    user: req.user.email
                }
            },
            {
                $lookup: {
                    from: 'tutions',
                    localField: 'tuition_id',
                    foreignField: '_id',
                    as: 'tutions'
                }
            },
            {
                $unwind: '$tutions'
            }
        ]).toArray();
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const editApplication = async (req, res) => {
    try{
        const data = await ApplyModel.findOne({
            _id: new ObjectId(req.params.id)
        })
        return res.status(200).json({
            success: true,
            data
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const updateApplication = async (req, res) => {
    try {
        await ApplyModel.updateOne({
            _id: new ObjectId(req.params.id),
        },{
            $set: {
                qualifications: req.body.qualifications,
                experience: req.body.experience,
                salary: req.body.salary
            }
        })
        res.status(200).json({
            success: true,
            message: 'Update Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const deleteApplication = async (req, res) => {
    try {
        await ApplyModel.deleteOne({
            _id: new ObjectId(req.params.id)
        })
        res.status(200).json({
            success: true,
            message: 'Deleted Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




export const TutorController = {
    allTutors,
    singleTutor,
    applyTuition,
    myApplications,
    updateApplication,
    deleteApplication,
    editApplication
}