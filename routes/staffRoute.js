var express = require('express');
var router = express.Router();
const staffController = require('../controllers/staffController')

// save clien action
router.put('/save-client-action', staffController.saveClientAction)

// save clien documentation
router.put('/document-client-action', staffController.documentClientAction)

module.exports = router;