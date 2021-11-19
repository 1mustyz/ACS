var express = require('express');
var router = express.Router();
const clientController = require('../controllers/clientController')

router.post('/recieve-client-notification', clientController.manageAlert)

module.exports = router;