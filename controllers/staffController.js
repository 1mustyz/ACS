const Staff = require('../models/staff')
const Client = require('../models/client')
const ClientAlert = require('../models/clientAlert')
const {uuid} = require('uuidv4')
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');

// save action perform on client
exports.saveClientAction = async (req,res,next) => {
    const {clientId,clientActions} = req.body
    clientActions.clientActionId = uuid()
    clientActions.month = new Date().getMonth() + 1

    const client = await Client.findOneAndUpdate({clientId},{$push:{"clientActions": clientActions}})
    await ClientAlert.findOneAndUpdate({clientId},{$set:{"alertActive": false}})
    console.log(clientActions)
    res.json({success: true, message: "client action saved successfully", client});
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

// set profile pic
exports.setProfilePic = async (req,res, next) => {

    singleUpload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
      return res.json(err.message);
      }
      else if (err) {
        return res.json(err);
      }
      else if (!req.file) {
        return res.json({"image": req.file, "msg":'Please select an image to upload'});
      }
      if(req.file){
          console.log(req.query.username)
          await Staff.findOneAndUpdate({username: req.query.username},{$set: {image: req.file.path}})
          const editedStaff = await Staff.findOne({username: req.query.username})

          return  res.json({success: true,
          message: editedStaff,
                     },
          
      );
      }
      });          
    
  }

  // edit staff
  exports.editStaff = async (req,res,next) => {
    const {username} = req.query;
    await Staff.findOneAndUpdate({username: username}, req.body)
    const editedStaff = await Staff.findOne({username})
    res.json({success: true, message: editedStaff})
  }

  // get all client actions based on staff
  exports.getStaffActionOnClient = async (req,res,next) => {
    const {username, clientId} = req.query;
    let staffActionsClient

    const client = await Client.find({clientId})

    client.forEach(client => {
      // console.log(client.clientActions)
      staffActionsClient = client.clientActions.filter(action => {
        return action.staffId == username
      })
    });

    console.log(staffActionsClient)
    res.json({success: true, message: staffActionsClient})
    
  }