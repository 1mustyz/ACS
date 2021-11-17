var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const staffController = require('../controllers/staffController')
const idGenerator = require('../middlewares/idGenerator')
const autth = require('../middlewares/auth')

/** All post request *//////////////////////////////////////////////

// register staff route
router.post('/register-staff', autth.isAdminLoggedIn(), idGenerator.staffIdGenerator, adminController.registerStaff)

// create client
router.post('/create-client', autth.isAdminLoggedIn(), adminController.registerClient)

// create action
router.post('/create-action', autth.isAdminLoggedIn(), adminController.createAction)

// login staff
router.post('/login',adminController.loginStaff)


/** All get request *///////////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', autth.isAdminLoggedIn(), adminController.findAllStaff)

// get single staff
router.get('/get-single-staff', autth.isAdminLoggedIn(), adminController.singleStaff)

// get all client
router.get('/get-all-client', autth.isAdminLoggedIn(), adminController.findAllClient)

// get single client
router.get('/get-single-client', autth.isAdminLoggedIn(), adminController.singleClient)

// get all actions
router.get('/get-all-actions', autth.isAdminLoggedIn(), adminController.findAllAction)

// get single action
router.get('/get-single-action', autth.isAdminLoggedIn(), adminController.singleAction)

// logout user
router.get('/logout', adminController.logout)



/** All put request *//////////////////////////////////////////////////////////

// edit single staff
router.put('/edit-single-staff', autth.isAdminLoggedIn(), adminController.editStaff)

// set profile pic
router.put('/set-profile-pic', autth.isAdminLoggedIn(), adminController.setProfilePic);



/** All delete request *////////////////////////////////////////////////////

// delete single staff
router.delete('/delete-single-staff', autth.isAdminLoggedIn(), adminController.removeStaff)

// delete client
router.delete('/delete-single-client', autth.isAdminLoggedIn(), adminController.removeClient)

// delete action
router.delete('/delete-single-action', autth.isAdminLoggedIn(), adminController.removeAction)

module.exports = router;