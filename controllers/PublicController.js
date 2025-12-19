import { ObjectId } from "mongodb";
import db from "../connection/mongodb.js"

const TuitionModel = db.collection('tutions')

const tuitionLists = async (req, res) => {
    try {
        
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limitPerPage = 10;
        const sortBy = req.query.sortby;
        const skip = (page - 1) * limitPerPage;

        
        const query = { status: 'approved' };
        
        
        if (req.query.location && req.query.location !== 'All Divisions') {
            query.location = req.query.location;
        }
        
        
        if (req.query.classInfo && req.query.classInfo !== 'All Classes') {
            query.className = req.query.classInfo;
        }
        
        
        if (req.query.subject?.trim()) {
            query.subject = {
                $regex: req.query.subject.trim(),
                $options: 'i'
            };
        }

        
        const sortOptions = {
            'salary-high-low': { salary: -1 },
            'salary-low-high': { salary: 1 }
        };
        const sortQuery = sortOptions[sortBy] || { createdAt: -1 };

        
        const [results, totalCount] = await Promise.all([
            
            TuitionModel.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limitPerPage)
                .toArray(),
            
            
            TuitionModel.countDocuments(query)
        ]);

        
        const totalPages = Math.ceil(totalCount / limitPerPage);

        const allTution = await TuitionModel.find({
            status: 'approved'
        }).toArray();

        return res.status(200).json({
            success: true,
            meta: {
                total: totalCount,
                page,
                limitPerPage,
                totalPages
            },
            data: {
                tuitions: results,
                allTution
            }
        });

    } catch (error) {
        console.error('Error in tuitionLists:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const singleTution = async (req, res) => {
    try{
        const id = req.params.id;
        const existsTution = await TuitionModel.findOne({
            _id: new ObjectId(id)
        })
        if(!existsTution) return res.status(404).json({
            success: false,
            message: 'Tution not found'
        })

        return res.status(200).json({
            success: true,
            data: existsTution
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const PublicController = {
    tuitionLists,
    singleTution
}