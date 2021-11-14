var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const idGenerator = require('../middlewares/idGenerator')

/** All post request *//////////////////////////////////////////////

// register staff route
router.post('/register-staff', idGenerator.staffIdGenerator, adminController.registerStaff)

// create client
router.post('/create-client', adminController.registerClient)

// create action
router.post('/create-action', adminController.createAction)

// login staff
router.post('/login',adminController.loginStaff)


/** All get request *///////////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', adminController.findAllStaff)

// get single staff
router.get('/get-single-staff', adminController.singleStaff)

// get all client
router.get('/get-all-client', adminController.findAllClient)

// get single client
router.get('/get-single-client', adminController.singleClient)

// get all actions
router.get('/get-all-actions', adminController.findAllAction)

// get single action
router.get('/get-single-action', adminController.singleAction)



/** All put request *//////////////////////////////////////////////////////////

// edit single staff
router.put('/edit-single-staff', adminController.editStaff)

// set profile pic
router.put('/set-profile-pic', adminController.setProfilePic);



/** All delete request *////////////////////////////////////////////////////

// delete single staff
router.delete('/delete-single-staff', adminController.removeStaff)

// delete client
router.delete('/delete-single-client', adminController.removeClient)

// delete action
router.delete('/delete-single-action', adminController.removeAction)

module.exports = router;