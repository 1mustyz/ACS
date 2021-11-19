var express = require('express');
var router = express.Router();
const clientController = require('../controllers/clientController')

router.get('/get-all-alert', clientController.getAllAlert)

module.exports = router;