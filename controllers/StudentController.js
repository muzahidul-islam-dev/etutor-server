import { ObjectId } from "mongodb";
import db from "../connection/mongodb.js";
import Stripe from "stripe";
import { config } from "../config/config.js";
const TuitionModel = db.collection('tutions');
const AppliesModel = db.collection('applies');
const TutorEmail = db.collection('users');
const stripe = new Stripe(config.STRIPE_API);
const createTution = async (req, res) => {
    try {
        const data = req.body;
        const finalData = {
            ...data,
            email: req.user.email,
            status: 'pending',
            createdAt: new Date(),
        }
        const result = await TuitionModel.insertOne(finalData);
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
    try {
        const result = await TuitionModel.find({
            email: req.user?.email
        }).toArray();
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const appliedTutors = async (req, res) => {
    try {
        const guardianEmail = req.user.email;

        const result = await TuitionModel.aggregate([
            {
                $match: {
                    email: guardianEmail
                }
            },
            {
                $lookup: {
                    from: "applies",
                    localField: "_id",
                    foreignField: "tuition_id",
                    as: "applies"
                }
            },
            {
                $unwind: "$applies"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "applies.user",
                    foreignField: "email",
                    as: "tutor"
                }
            },
            {
                $unwind: "$tutor"
            },
            {
                $project: {
                    _id: 0,
                    tutorId: "$tutor._id",
                    name: "$tutor.name",
                    email: "$tutor.email",
                    image: "$tutor.image",
                    appliedSalary: "$applies.salary",
                    appliedAt: "$applies.createdAt",
                    status: "$applies.status",
                }
            },
            {
                $group: {
                    _id: "$tutorId",
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    appliedSalary: { $first: "$appliedSalary" },
                    status: { $first: "$status" },
                    date: { $first: "$appliedAt" },
                }
            }
        ]).toArray();
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const appliedTutorsByTuition = async (req, res) => {
    try {
        const tuitionId = req.params.id;

        const result = await AppliesModel.aggregate([
            {
                $match: {
                    tuition_id: new ObjectId(tuitionId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: 'email',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    salary: 1,
                    createdAt: 1,
                    status: 1,
                    user: {
                        name: '$user.name',
                        email: '$user.email',
                        image: '$user.image'
                    }
                }
            }
        ]).toArray();
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const studentPayment = async (req, res) => {
    try {
        const id = req.params.id;
        const tutorEmail = await TutorEmail.findOne({
            _id: new ObjectId(id)
        })
        const appliesDetails = await AppliesModel.findOne({
            user: tutorEmail.email
        })
        const tuitionDetails = await TuitionModel.findOne({
            _id: new ObjectId(appliesDetails.tuition_id)
        })
        // return res.json({data: appliesDetails._id})
        const amount = parseInt(appliesDetails.salary) * 100
        const payment = await stripe.checkout.sessions.create({
            success_url: `${config.SUCCESS_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            line_items: [
                {
                    price_data: {
                        currency: 'BDT',
                        unit_amount: amount,
                        product_data: {
                            name: tuitionDetails.title
                        }
                    },
                    quantity: 1,
                },
            ],
            customer_email: tutorEmail.email,
            mode: 'payment',
            metadata: {
                tuitionId: appliesDetails.user
            },
            cancel_url: `${config.SUCCESS_URL}/payment-cancel`
        })

        res.status(200).json({
            success: true,
            url: payment.url
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const paymentVerify = async (req, res) => {
    try {
        const paymentInfo = await stripe.checkout.sessions.retrieve(req.params.id)
        if (paymentInfo.payment_status == 'paid') {
            const tutorEmail = paymentInfo.metadata.tuitionId;
            const appliesData = await AppliesModel.findOne({
                user: tutorEmail
            });
            const purpose = await TuitionModel.findOne({
                _id: new ObjectId(appliesData?.tuition_id)
            })
            await AppliesModel.updateOne({
                user: tutorEmail
            }, {
                $set: {
                    status: 'completed'
                }
            })
            await TuitionModel.updateOne({
                _id: new ObjectId(appliesData?.tuition_id)
            }, {
                $set: {
                    status: 'completed'
                }
            })
            res.status(200).json({
                success: true,
                data: paymentInfo,
                purpose: purpose
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'No valied data'
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const paymentHistory = async (req, res) => {
    try {

        const data = await TuitionModel.aggregate([
            {
                $match: {
                    email: req.user.email,
                    status: 'completed'
                }
            }
        ]).toArray();
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

export const StudentController = {
    createTution,
    allTutions,
    appliedTutors,
    appliedTutorsByTuition,
    studentPayment,
    paymentVerify,
    paymentHistory
}