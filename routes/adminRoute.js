var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const staffController = require('../controllers/staffController')
const idGenerator = require('../middlewares/idGenerator')
const passport = require('passport');

/** All post request *//////////////////////////////////////////////

// register staff route
router.post('/register-staff', passport.authenticate("jwt.admin",{session:false}),idGenerator.staffIdGenerator, adminController.registerStaff)

// create client
router.post('/create-client',  adminController.registerClient)

// create action
router.post('/create-action', passport.authenticate("jwt.admin",{session:false}), adminController.createAction)

// login staff
router.post('/login', adminController.loginStaff)


/** All get request *///////////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', adminController.findAllStaff)

// get single staff
router.get('/get-single-staff', passport.authenticate("jwt.admin",{session:false}), adminController.singleStaff)

// get all client
router.get('/get-all-client',  adminController.findAllClient)

// get single client
router.get('/get-single-client', passport.authenticate("jwt.admin",{session:false}), adminController.singleClient)

// get all actions
router.get('/get-all-actions', passport.authenticate("jwt.admin",{session:false}), adminController.findAllAction)

// get single action
router.get('/get-single-action', passport.authenticate("jwt.admin",{session:false}), adminController.singleAction)

// get all statistics
router.get('/statistics', adminController.statistics)
router.get('/statistics-aggregate', adminController.statisticsAgregate)

// logout user
router.get('/logout', adminController.logout)



/** All put request *//////////////////////////////////////////////////////////

// edit single staff
router.put('/edit-single-staff', passport.authenticate("jwt.admin",{session:false}), adminController.editStaff)

// set profile pic
router.put('/set-profile-pic', passport.authenticate("jwt.admin",{session:false}), adminController.setProfilePic);



/** All delete request *////////////////////////////////////////////////////

// delete single staff
router.delete('/delete-single-staff', passport.authenticate("jwt.admin",{session:false}), adminController.removeStaff)

// delete client
router.delete('/delete-single-client', passport.authenticate("jwt.admin",{session:false}), adminController.removeClient)

// delete action
router.delete('/delete-single-action', passport.authenticate("jwt.admin",{session:false}), adminController.removeAction)

module.exports = router;