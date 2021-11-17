var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const staffController = require('../controllers/staffController')
const idGenerator = require('../middlewares/idGenerator')
const autth = require('../middlewares/auth')

/** All post request *//////////////////////////////////////////////

// register staff route
router.post('/register-staff', autth.isStaffLoggedIn(), idGenerator.staffIdGenerator, adminController.registerStaff)

// create client
router.post('/create-client', autth.isStaffLoggedIn(), adminController.registerClient)

// create action
router.post('/create-action', autth.isStaffLoggedIn(), adminController.createAction)

// login staff
router.post('/login',adminController.loginStaff)


/** All get request *///////////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', autth.isStaffLoggedIn(), adminController.findAllStaff)

// get single staff
router.get('/get-single-staff', autth.isStaffLoggedIn(), adminController.singleStaff)

// get all client
router.get('/get-all-client', autth.isStaffLoggedIn(), adminController.findAllClient)

// get single client
router.get('/get-single-client', autth.isStaffLoggedIn(), adminController.singleClient)

// get all actions
router.get('/get-all-actions', autth.isStaffLoggedIn(), adminController.findAllAction)

// get single action
router.get('/get-single-action', autth.isStaffLoggedIn(), adminController.singleAction)

// logout user
router.get('/logout', adminController.logout)



/** All put request *//////////////////////////////////////////////////////////

// edit single staff
router.put('/edit-single-staff', autth.isStaffLoggedIn(), adminController.editStaff)

// set profile pic
router.put('/set-profile-pic', autth.isStaffLoggedIn(), adminController.setProfilePic);



/** All delete request *////////////////////////////////////////////////////

// delete single staff
router.delete('/delete-single-staff', autth.isStaffLoggedIn(), adminController.removeStaff)

// delete client
router.delete('/delete-single-client', autth.isStaffLoggedIn(), adminController.removeClient)

// delete action
router.delete('/delete-single-action', autth.isStaffLoggedIn(), adminController.removeAction)

module.exports = router;