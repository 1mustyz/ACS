var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const idGenerator = require('../middlewares/idGenerator')

/** All post request */

// register staff route
router.post('/register-staff', idGenerator.staffIdGenerator, adminController.registerStaff)

// login staff
router.post('/login',adminController.loginStaff)


/** All get request */

// get all staff
router.get('/get-all-staff', adminController.findAllStaff)

// get single staff
router.get('/get-single-staff', adminController.singleStaff)


/** All put request */

// edit single staff
router.put('/edit-single-staff', adminController.editStaff)

// set profile pic
router.put('/set-profile-pic', adminController.setProfilePic);



/** All delete request */

// delete single staff
router.delete('/delete-single-staff', adminController.removeStaff)

module.exports = router;