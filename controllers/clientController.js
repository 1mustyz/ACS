const Pusher = require('pusher')

const pusher = new Pusher({
    app_id: "1236911",
    key: "2e43b248a65f500c42e1",
    secret: "d420b43dabbda03f1610",
    cluster: "mt1"
})

exports.manageAlert = (req,res,next) => {

        pusher.trigger("notifications", "alert", {
            message: "hello world"
          });
}