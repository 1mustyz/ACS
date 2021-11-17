var express = require('express');
var router = express.Router();
const staffController = require('../controllers/staffController')
const adminController = require('../controllers/adminController')

/** All put request *//////////////////////////////////////////////////////////

// save client action
router.put('/save-client-action', staffController.saveClientAction)

// save client documentation
router.put('/document-client-action', staffController.documentClientAction)


/** All get request *//////////////////////////////////////////////////////////

// logout user
router.get('/logout', staffController.logout)


/** All post request *//////////////////////////////////////////////////////////

// login staff
router.post('/login',adminController.loginStaff)

module.exports = router;