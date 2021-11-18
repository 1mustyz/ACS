var express = require('express');
var router = express.Router();
const Pusher = require("pusher");

/* GET home page. */
router.get('/', function(req, res, next) {
  
  
  const pusher = new Pusher({
    app_id : "1236911",
    key : "2e43b248a65f500c42e1",
    secret : "d420b43dabbda03f1610",
    cluster : "mt1",
    useTLS: true
  });
  
  pusher.trigger("my-channel", "my-event", {
    message: "hello world"
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
