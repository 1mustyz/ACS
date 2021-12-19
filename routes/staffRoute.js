var express = require('express');
var router = express.Router();
const staffController = require('../controllers/staffController')
const adminController = require('../controllers/adminController')
const chartController = require('../controllers/chartController')

/** All put request *//////////////////////////////////////////////////////////

// save client action
router.put('/save-client-action', staffController.saveClientAction)

// save client documentation
router.put('/document-client-action', staffController.documentClientAction)

// save profile pic
router.put('/save-staff-profile-pic', staffController.setProfilePic)

// edit staff
router.put('/edit-staff', staffController.editStaff)

// save client sud
router.put('/client-sud', staffController.createSUD)


/** All get request *//////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', adminController.findAllStaff)

// get prev chart
router.get('/get-prev-chart', chartController.getPrevChart)

// get staff action based on client
router.get('/get-staff-actions-base-on-client', staffController.getStaffActionOnClient)

// logout user
router.get('/logout', staffController.logout)

// client demographic
router.get('/get-client-demographic', staffController.getClientDemographic)


/** All post request *//////////////////////////////////////////////////////////

// login staff
router.post('/login',adminController.loginStaff)

module.exports = router;