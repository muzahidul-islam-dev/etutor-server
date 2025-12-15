import db from "../connection/mongodb.js";

const StudentModel = db.collection('tutions');
const createTution = async (req, res) => {
    try {
        const data = req.body;
        const finalData = {
            ...data,
            email: req.user.email,
            status: 'pending',
            createdAt: new Date(),
        }
        const result = await StudentModel.insertOne(finalData);
        if (result.acknowledged) {
            res.status(200).json({
                success: true,
                message: 'Tution create successfully'
            })
        } else {
            res.status(500).json({
                success: false,
                message: "Data not save",
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const allTutions = async (req, res) => {
    try{
        const result = await StudentModel.find({
            email: req.user?.email
        }).toArray();
        return res.status(200).json({
            success: true,
            data: result
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const StudentController = {
    createTution,
    allTutions
}