const Staff = require('../models/staff')
const Client = require('../models/client')
const ClientAlert = require('../models/clientAlert')
const {uuid} = require('uuidv4')
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');
const msToTime = require('../middlewares/timeMiddleware')
const fs = require('fs');
const cloudinary = require('cloudinary');

// cloudinary configuration for saving files
cloudinary.config({
    cloud_name: 'mustyz',
    api_key: '727865786596545',
    api_secret: 'HpUmMxoW8BkmIRDWq_g2-5J2mD8'
})
// save action perform on client
exports.saveClientAction = async (req,res,next) => {
    const {clientId,clientActions} = req.body
    clientActions.clientActionId = uuid()

    clientActions.createdAt = new Date()
   

    // console.log(clientActions.createdAt)

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

// client SUD
exports.createSUD = async (req,res,next) => {
  const {clientId,sud} = req.body

  const client = await Client.findOneAndUpdate({clientId},
  {$set:{sud: sud}})

  // console.log(clientActions)
  res.json({success: true, message: "client sud saved successfully"});
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
        if(req.query.hasOwnProperty('username') && Object.keys(req.query).length == 1){
          const result = await Staff.findOne({username: req.query.username},{_id: 0,image: 1})
  

          const imageName = result.image.split('/').splice(7)
          console.log('-----------------',imageName)
  
          cloudinary.v2.api.delete_resources_by_prefix(imageName[0], 
          {
            invalidate: true,
            resource_type: "raw"
        }, 
          function(error,result) {
            console.log(result, error) }); 


        cloudinary.v2.uploader.upload(req.file.path, 
          { resource_type: "raw" }, 
      async function(error, result) {
          console.log(result, error); 
  
          await Staff.findOneAndUpdate({username: req.query.username},{$set: {image: result.secure_url}})
            const editedStaff = await Staff.findOne({username: req.query.username})
            
            res.json({success: true,
              message: editedStaff,
                         },
          
      );
          });
        }
      }else{
        return  res.json({success: true, err,  })
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
    let staffActionsClient = []

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

  // Client Demographic
  exports.getClientDemographic = async (req,res,next) =>{
    const {clientId} = req.query

    const clientDemographic = await Client.findOne({clientId},{clientActions:0,_id:0})
    res.json({success: true, clientDemographic})

  }