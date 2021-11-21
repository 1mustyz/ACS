const Staff = require('../models/staff')
const Client = require('../models/client')
const Action = require('../models/action')
const ClientAlert = require('../models/clientAlert')
const passport = require('passport');
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');
const { uuid } = require('uuidv4');
const jwt =require('jsonwebtoken');

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
        console.log(req.query.username)
        await Staff.findOneAndUpdate({username: req.query.username},{$set: {image: req.file.path}})
        return  res.json({success: true,
        message: req.file.path,
                   },
        
    );
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
  await Action.collection.insertOne(req.body)
  res.json({success: true, message: 'action created successfullty'});
}

// edit action
exports.editAction = async (req,res,next) => {
  const {actionId,actionName,actionInfo} = req.body
  await Action.updateOne({actionId},{actionName,actionInfo})
  res.json({success: true, message: 'action edited successfullty'});
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
  const numberOfStaff = await Staff.find({}).count()
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
    feb: {numberOfDispatchActionFeb,numberOfDispatchActionFeb},
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