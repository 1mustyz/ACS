const ClientAlert = require('../models/clientAlert')

exports.getAllAlert = async (req,res,next) => {

    const allAlert = await ClientAlert.find({})
       
    res.json({success:true, message: allAlert})

}

exports.getAllActiveAlert = async (req,res,next) => {

    const allActiveAlert = await ClientAlert.find({"alertActive": true})
       
    res.json({success:true, message: allActiveAlert})

}