const ClientAlert = require('../models/clientAlert')

exports.getAllAlert = async (req,res,next) => {

    const allAlert = await ClientAlert.find({})
       
    res.json({success:true, message: allAlert})

}