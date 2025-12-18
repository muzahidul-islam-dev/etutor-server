import db from "../connection/mongodb.js";

const TutionModel = db.collection('tutions');
const TutorModel = db.collection('users');
const tutionsLists = async (req, res) => {
    try{
        const data = await TutionModel.find().limit(4).sort({createdAt: -1}).toArray();
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

const tutorLists = async (req, res) => {
    try{
        const data = await TutorModel.find({
            role: 'tutor'
        }).limit(4).sort({
            createdAt: -1
        }).toArray()
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



export const HomeController = {
    tutionsLists,
    tutorLists
}