const Staff = require('../models/staff')
const Client = require('../models/client')
const Action = require('../models/action')
const ClientAlert = require('../models/clientAlert')
const passport = require('passport');
const multer = require('multer');
const {singleUpload,singleFileUpload} = require('../middlewares/filesMiddleware');
const { uuid } = require('uuidv4');
const jwt =require('jsonwebtoken');
const csv = require('csv-parser')
const fs = require('fs')
const msToTime = require('../middlewares/timeMiddleware')
const mailler = require('../middlewares/mailjetMiddleware')

exports.mall = async (req,res,next) => {
  mailler("onemusty.z@gmail.com", "Yusuf", "onemusty.z@gmail.com", "Yusuf")
  .then((result) => {
    console.log(result.body)
    res.json(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
} 
// staff registration controller
exports.registerStaff = async (req, res, next) => {
    try {

      //create the user instance
      user = new Staff(req.body)
      const password = req.body.password ? req.body.password : 'password'
      //save the user to the DB
      await Staff.register(user, password, function (error, user) {
        if (error) return res.json({ success: false, error }) 
        const newUser = {
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        }
        res.json({ success: true, newUser })
      })
    } catch (error) {
      res.json({ success: false, error })
    }
  }

  // reset password
  exports.changePassword = async (req, res, next) => {
    const {username} = req.query
    Staff.findOne({ username },(err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
             if(err) {
                      if(err.name === 'IncorrectPasswordError'){
                           res.json({ success: false, message: 'Incorrect password' }); // Return error
                      }else {
                          res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                      }
            } else {
              res.json({ success: true, message: 'Your password has been changed successfully' });
             }
           })
        }
      }
    });
  }

  // staff login controller
exports.loginStaff = (req, res, next) => {

  let payLoad = {}
  // perform authentication
  passport.authenticate('staff', (error, user, info) => {
    if (error) return res.json({ success: false, error })
    if (!user)
      return res.json({
        success: false,
        message: 'username or password is incorrect'
      })
    //login the user  
    req.login(user, (error) => {
      if (error){
        res.json({ success: false, message: 'something went wrong pls try again' })
      }else {
        req.session.user = user
        payLoad.id = user.username
        const token = jwt.sign(payLoad, 'myVerySecret');

        const newUser = {
          token: token,
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        }
        
        res.json({ success: true, message: 'staff login successful', newUser})
      }
    })
  })(req, res, next)
}

 

// logout
exports.logout = (req, res,next) => {

  console.log(req.session)

  if (req.session.user.role == "admin"){

      req.logout();
      res.json({success: true, message: "logout successfully"});
  }
}

// find all staff
exports.findAllStaff = async (req,res, next) => {

  const result = await Staff.find({});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// get staff only
exports.getOnlyStaff = async (req,res, next) => {

  const result = await Staff.find({role: "staff"});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// get admin only
exports.getOnlyAdmin = async (req,res, next) => {

  const result = await Staff.find({role: "admin"});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// find single staff
exports.singleStaff = async (req,res, next) => {
  const {username} = req.query

  const result = await Staff.findOne({username: username});
  result
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
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

      // console.log(Object.keys(req.query).length)
      // try {
      //   fs.unlinkSync(req.file.path)
      //   //file removed
      // } catch(err) {
      //   console.error(err)
      // }

      if(req.query.hasOwnProperty('username') && Object.keys(req.query).length == 1){
        const result = await Staff.findOne({username: req.query.username},{_id: 0,image: 1})

        try {
          fs.unlinkSync(result.image)
          //file removed
        } catch(err) {
          console.error(err)
        }
          console.log(result)
        await Staff.findOneAndUpdate({username: req.query.username},{$set: {image: req.file.path}})
        const editedStaff = await Staff.findOne({username: req.query.username})
        
        res.json({success: true,
          message: editedStaff,
                     },
          
      );
      }else if(req.query.hasOwnProperty('clientId') && Object.keys(req.query).length == 1){
        const result = await Client.findOne({clientId: req.query.clientId},{_id: 0,image: 1,})

      try {
        fs.unlinkSync(result.image)
        //file removed
      } catch(err) {
        console.error(err)
      }
        console.log(result)

        await Client.findOneAndUpdate({clientId: req.query.clientId},{$set: {image: req.file.path}})
        const editedClient = await Client.findOne({clientId: req.query.clientId})

        res.json({success: true,
          message: editedClient,
                     },
          
      );

      }
     
       
    }
    });

        
  
}

// delete or remove staff
exports.removeStaff = async (req,res,next) => {
  const {username} = req.query;
  await Staff.findOneAndDelete({username: username})
  res.json({success: true, message: `staff with the id ${username} has been removed`})
}

// edit staff
exports.editStaff = async (req,res,next) => {
  const {username} = req.query;
  await Staff.findOneAndUpdate({username: username}, req.body)
  res.json({success: true, message: `staff with the username ${username} has been edited`})
}


/**** CLEINT START HERE     ****//////////////////////////////////////////////

// register client
exports.registerClient = async (req,res,next) => {
  req.body.clientId = uuid()
  const client = await Client.collection.insertOne(req.body)
  res.json({success: true, message: 'client created successfullty', client});
}

// edit client 
exports.editClient = async (req,res,next) => {
  const {clientId} = req.query;
  await Client.findOneAndUpdate({clientId}, req.body)
  res.json({success: true, message: `client with the clientId ${clientId} has been edited`})
}


// register a client from a file
exports.registerClientFromAfile = async (req,res,next) => {

  const clients = []

  singleFileUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
    return res.json(err.message);
    }
    else if (err) {
      return res.json(err);
    }
    else if (!req.file) {
      return res.json({"file": req.file, "msg":'Please select file to upload'});
    }
    if(req.file){
        console.log(req.file.path)

        fs.createReadStream(req.file.path)
        .pipe(csv({}))
        .on('data', (data)=> clients.push(data))
        .on('end', async () => {
          // console.log(clients)
          clients.map(client => {
            client.clientId = uuid()
          })
          console.log(clients)
          const clientes = await Client.insertMany(clients)

          try {
            fs.unlinkSync(req.file.path)
            //file removed
          } catch(err) {
            console.error(err)
          }
          res.json({success:true, message: clientes})
        })

       
    }
    });    


  




}


// delete or remove client
exports.removeClient = async (req,res,next) => {
  const {clientId} = req.query;
  await Client.findOneAndDelete({clientId})
  res.json({success: true, message: `client with the id ${clientId} has been removed`})
}

// find all client
exports.findAllClient = async (req,res, next) => {

  const result = await Client.find({});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// find single client
exports.singleClient = async (req,res, next) => {
  const {clientId} = req.query

  const result = await Client.findOne({clientId});
  result
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}



/**** ACTION START HERE     ****//////////////////////////////////////////////

// create an action
exports.createAction = async (req,res,next) => {
  req.body.actionId = uuid()
  const {contactList} = req.body

  if(contactList.length > 0){
    contactList.map(contact => {
      contact.contactId = uuid()
    })
  }

  await Action.collection.insertOne(req.body)
  // console.log(req.body)
  res.json({success: true, message: 'action created successfullty'});
}

// edit action
exports.editAction = async (req,res,next) => {
  const {actionId,actionName,actionInfo} = req.body
  await Action.findOneAndUpdate({actionId},{actionName,actionInfo})
  res.json({success: true, message: 'action edited successfullty'});
}

// add contactlist to action
exports.addContactList = async (req,res,next) => {
  const {actionId, contact} = req.body
  contact.contactId = uuid()
  
 const result = await Action.findOneAndUpdate({actionId},{$push:{"contactList":contact}})
  res.json({success: true, message: result});

}

// update a contact
exports.updateContact = async (req,res,next) => {
  const {contactId, contact} = req.body
  
 const result = await Action.findOneAndUpdate({"contactList.contactId":contactId},{$set:{"contactList.$.contact":contact}})
  res.json({success: true, message: "contact updated successfully"});

}

exports.deleteSingleContact = async (req,res,next) => {
  const {contactId} = req.query
  
 const result = await Action.findOneAndUpdate({"contactList.contactId":contactId},{$pull: {contactList:{contactId}}})
  res.json({success: true, message: "contact deleted successfully"});

}


// delete or remove client
exports.removeAction = async (req,res,next) => {
  const {actionId} = req.query;
  await Action.findOneAndDelete({actionId})
  res.json({success: true, message: `action with the id ${actionId} has been removed`})
}

// find all client
exports.findAllAction = async (req,res, next) => {

  const result = await Action.find({});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// find single client
exports.singleAction = async (req,res, next) => {
  const {actionId} = req.query

  const result = await Action.findOne({actionId});
  result
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

exports.statistics = async(req,res,next) => {

  // number of alert
  const numberOfAlert = await ClientAlert.find({}).count()

  //
  const client = await Client.find({clientActions:{$exists:true}}, {clientActions: 1})
  const numberOfStaff = await Staff.find({role: "staff"}).count()
  const numberOfClient = await Client.find({}).count()

  let numberOfDispatchAction = 0
  client.forEach(client => {
    // client.clientActions.
    console.log(client.clientActions.length)
    numberOfDispatchAction += client.clientActions.length
    console.log(numberOfDispatchAction)

  });

  res.json({numberOfAlert,numberOfClient,numberOfStaff,numberOfDispatchAction})
}

// all client dispatch action
exports.clientDispatchAction = async (req,res,next) => {
  const result = await Client.find({},{clientActions: 1, _id: 0})

  const sumArray = []
  result.map(client => {
    sumArray.push(client.clientActions.length)
  })
  console.log(sumArray)

  let sumTotal = sumArray.reduce((a,b)=> (+a +  +b),0 )

  console.log(sumTotal)

  res.json({success:true, totalDispatchAction: sumTotal})

}

exports.clientDispatchActionAtParticularTime = async (req,res,next) => {
  let data = []

  function compare( a, b ) {
    if ( a.createdAt < b.createdAt ){
      return -1;
    }
    if ( a.createdAt > b.createdAt ){
      return 1;
    }
    return 0;
  }

   const client = await Client.find({},
    {clientActions: 1, clientId: 1, fullName: 1, _id: 0})

    client.forEach(action => {
        if(action.clientActions.length > 0){
          action.clientActions.forEach(requiredAction => {
            requiredAction.clientId = action.clientId
            requiredAction.clientName = action.fullName 
            data.push(requiredAction)
          })
        }
      })           
    data.sort(compare).reverse()  
    // console.log(data)
  res.json({success: true, data})

}

// all client dispatch action base on time and date
// exports.clientDispatchActionAtParticularTime = async (req,res,next) => {
//   const d = new Date()
//   let obj = {} 

//  const client = await Client.find({},
//     {clientActions: 1, clientId: 1, fullName: 1, _id: 0})

//  async function recursion(month,day,time){
//     let data =  []

//     if(time < 1){
//       return
//     }
//     else if(time == 24){
      
//         client.forEach(action => {
//           if(action.clientActions.length > 0){
//            action.clientActions.forEach(requiredAction => {
//              if(requiredAction.month == month && requiredAction.createdAt == time && requiredAction.day == day){
//               requiredAction.clientId = action.clientId
//               requiredAction.clientName = action.fullName 
//               data.push(requiredAction)
//              }
//            })
//           }
           
//        })
//        obj[0] = data 

//     }else{
      
//           client.forEach(action => {
//             if(action.clientActions.length > 0){
//              action.clientActions.forEach(requiredAction => {
//                if(requiredAction.month == month && requiredAction.createdAt == time && requiredAction.day == day){
//                 requiredAction.clientId = action.clientId
//                 requiredAction.clientName = action.fullName  
//                 data.push(requiredAction)
//                }
//              })
//             }
             
//         })
//         obj[time] = data
     
//         await recursion(month,day,(time - 1))
//     }

//   }
//   await recursion(d.getMonth() + 1, d.getDay(), (parseInt(msToTime(d.getTime())) + 1))
//   // recursion(12,6,22)
//   console.log(d.getMonth() + 1, d.getDay(), (parseInt(msToTime(d.getTime())) + 1))
//   // console.log(obj)
//   res.json({success: true, obj})

// }


exports.statisticsAgregate = async (req,res,next) => {
  const numberOfAlertJan = await ClientAlert.find({month: 1}).count()
  const numberOfDispatchActionJan = await Client.find({"clientActions.0.month": 1}).count()
  
  const numberOfAlertFeb = await ClientAlert.find({month: 2}).count()
  const numberOfDispatchActionFeb = await Client.find({"clientActions.0.month": 2}).count()

  const numberOfAlertMarch = await ClientAlert.find({month: 3}).count()
  const numberOfDispatchActionMarch = await Client.find({"clientActions.0.month": 3}).count()

  const numberOfAlertApril = await ClientAlert.find({month: 4}).count()
  const numberOfDispatchActionApril = await Client.find({"clientActions.0.month": 4}).count()

  const numberOfAlertMay = await ClientAlert.find({month: 5}).count()
  const numberOfDispatchActionMay = await Client.find({"clientActions.0.month": 5}).count()

  const numberOfAlertJun = await ClientAlert.find({month: 6}).count()
  const numberOfDispatchActionJun = await Client.find({"clientActions.0.month": 6}).count()

  const numberOfAlertJul = await ClientAlert.find({month: 7}).count()
  const numberOfDispatchActionJul = await Client.find({"clientActions.0.month": 7}).count()

  const numberOfAlertAug = await ClientAlert.find({month: 8}).count()
  const numberOfDispatchActionAug = await Client.find({"clientActions.0.month": 8}).count()

  const numberOfAlertSep = await ClientAlert.find({month: 9}).count()
  const numberOfDispatchActionSep = await Client.find({"clientActions.0.month": 9}).count()

  const numberOfAlertOct = await ClientAlert.find({month: 10}).count()
  const numberOfDispatchActionOct = await Client.find({"clientActions.0.month": 10}).count()

  const numberOfAlertNov = await ClientAlert.find({month: 11}).count()
  const numberOfDispatchActionNov = await Client.find({"clientActions.0.month": 11}).count()

  const numberOfAlertDec = await ClientAlert.find({month: 12}).count()
  const numberOfDispatchActionDec = await Client.find({"clientActions.0.month": 12}).count()

  res.json({
    jan: {numberOfAlertJan,numberOfDispatchActionJan},
    feb: {numberOfAlertFeb,numberOfDispatchActionFeb},
    march: {numberOfAlertMarch,numberOfDispatchActionMarch},
    april: {numberOfAlertApril,numberOfDispatchActionApril},
    may: {numberOfAlertMay,numberOfDispatchActionMay},
    jun: {numberOfAlertJun,numberOfDispatchActionJun},
    july: {numberOfAlertJul,numberOfDispatchActionJul},
    Aug: {numberOfAlertAug,numberOfDispatchActionAug},
    sep: {numberOfAlertSep,numberOfDispatchActionSep},
    oct: {numberOfAlertOct,numberOfDispatchActionOct},
    nov: {numberOfAlertNov,numberOfDispatchActionNov},
    dec: {numberOfAlertDec,numberOfDispatchActionDec}
  })

}