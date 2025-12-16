import db from "../connection/mongodb.js"

const TuitionModel = db.collection('tutions')
const tuitionLists = async (req, res) => {
    try{

        const query = {
            status: 'approved'
        };

        if(req?.query?.location != 'All Divisions'){
            query.location = req?.query?.location;
        }
        if(req?.query?.classInfo != 'All Classes'){
            query.className = req?.query?.classInfo;
        }
        if(req?.query?.search != '' && req?.query?.search){
            query.className = req.query.classInfo;
        }

        
        const results = await TuitionModel.find(query).toArray();

        const allTution = await TuitionModel.find({
            status: 'approved'
        }).toArray();
        return res.status(200).json({
            success: true,
            data: {
                tuitions: results,
                allTution: allTution
            }
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