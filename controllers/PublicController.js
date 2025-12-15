import db from "../connection/mongodb.js"

const TuitionModel = db.collection('tutions')
const tuitionLists = async (req, res) => {
    try{
        const results = await TuitionModel.find({
            status: 'approved'
        }).toArray();
        return res.status(200).json({
            success: true,
            data: results
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const PublicController = {
    tuitionLists
}