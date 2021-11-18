const Staff = require('../models/staff')
const Client = require('../models/client')
const Action = require('../models/action')
const passport = require('passport');
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');
const { uuid } = require('uuidv4');

// staff registration controller
exports.registerStaff = async (req, res, next) => {
    try {

      //create the user instance
      user = new Staff(req.body)
      const password = req.body.password ? req.body.password : 'password'
      //save the user to the DB
      await Staff.register(user, password, function (error, user) {
        if (error) return res.json({ success: false, error }) 
        res.json({ success: true, user })
      })
    } catch (error) {
      res.json({ success: false, error })
    }
  }

  // staff login controller
exports.loginStaff = (req, res, next) => {

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
  await Client.collection.insertOne(req.body)
  res.json({success: true, message: 'client created successfullty'});
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