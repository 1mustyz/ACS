const ClientAlert = require('../models/clientAlert')

exports.getAllAlert = async (req,res,next) => {

    const allAlert = await ClientAlert.find({}).sort({createdAt: 1})
       
    res.json({success:true, message: allAlert})

}

exports.getAllActiveAlert = async (req,res,next) => {

    const allActiveAlert = await ClientAlert.find({"alertActive": true}).sort({createdAt: 1})
       
    res.json({success:true, message: allActiveAlert})

}