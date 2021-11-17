const Staff = require('../models/staff')
const Client = require('../models/client')
const {uuid} = require('uuidv4')

// save action perform on client
exports.saveClientAction = async (req,res,next) => {
    const {clientId,clientActions} = req.body
    clientActions.clientActionId = uuid()

    const client = await Client.findOneAndUpdate({clientId},{$push:{"clientActions": clientActions}})

    console.log(clientActions)
    res.json({success: true, message: "client action saved successfully"});
}

// document action perform on client
exports.documentClientAction = async (req,res,next) => {
    const {clientId,clientActionId,documentation} = req.body

    const client = await Client.findOneAndUpdate({"clientActions.clientActionId": clientActionId},
    {$set:{"clientActions.$.documentation": documentation}})

    // console.log(clientActions)
    res.json({success: true, message: "client documentation saved successfully"});
}


// logout
exports.logout = (req, res,next) => {

    if (req.session.user.role == "staff"){

        req.logout();
        res.json({success: true, message: "logout successfully"});
    }
}