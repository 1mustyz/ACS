var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const staffController = require('../controllers/staffController')
const idGenerator = require('../middlewares/idGenerator')
const passport = require('passport');

/** All post request *//////////////////////////////////////////////

// register staff route
router.post('/register-staff', idGenerator.staffIdGenerator, adminController.registerStaff)

// create client
router.post('/create-client',  adminController.registerClient)

// create client from a file
router.post('/create-client-from-file', adminController.registerClientFromAfile)

// create action
router.post('/create-action',  adminController.createAction)

// login staff
router.post('/login', adminController.loginStaff)


/** All get request *///////////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', adminController.findAllStaff)
router.get('/mall', adminController.mall)

// get only staff
router.get('/get-only-staff', adminController.getOnlyStaff)

// get only admin
router.get('/get-only-admin', adminController.getOnlyAdmin)


// get single staff
router.get('/get-single-staff', passport.authenticate("jwt.admin",{session:false}), adminController.singleStaff)

// get all client
router.get('/get-all-client',  adminController.findAllClient)

// get single client
router.get('/get-single-client', passport.authenticate("jwt.admin",{session:false}), adminController.singleClient)

// get all actions
router.get('/get-all-actions',  adminController.findAllAction)

// get single action
router.get('/get-single-action', passport.authenticate("jwt.admin",{session:false}), adminController.singleAction)

// get all statistics
router.get('/statistics', adminController.statistics)
router.get('/statistics-aggregate', adminController.statisticsAgregate)

// get all client dispatch action
router.get('/get-all-clients-dispatch-action', adminController.clientDispatchAction)

// get all client dispatch action base on time and date
router.get('/get-all-clients-dispatch-action-at-particular-time', adminController.clientDispatchActionAtParticularTime)

// logout user
router.get('/logout', adminController.logout)



/** All put request *//////////////////////////////////////////////////////////

// edit single staff
router.put('/edit-single-staff', passport.authenticate("jwt.admin",{session:false}), adminController.editStaff)

// passport.authenticate("jwt.admin",{session:false}),

// set profile pic
router.put('/set-profile-pic',  adminController.setProfilePic);

// edit action
router.put('/edit-action', adminController.editAction)

// add contact list
router.put('/add-contact', adminController.addContactList)

// update a single contact
router.put('/update-a-contact', adminController.updateContact)

// edit client
router.put('/edit-client', adminController.editClient)

// change password
router.post('/change-password', adminController.changePassword)



/** All delete request *////////////////////////////////////////////////////

// delete single staff
router.delete('/delete-single-staff', passport.authenticate("jwt.admin",{session:false}), adminController.removeStaff)

// delete client
router.delete('/delete-single-client', passport.authenticate("jwt.admin",{session:false}), adminController.removeClient)

// delete action
router.delete('/delete-single-action', passport.authenticate("jwt.admin",{session:false}), adminController.removeAction)

module.exports = router;