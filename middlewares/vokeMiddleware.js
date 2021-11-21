const Chart = require('../models/chart')


exports.generateChatKey = async (req, res, next) => {
    const {senderId,receiverId} = req.body

    const vokedOne = Chart.find({senderId,receiverId})
    const vokedTwo = Chart.find({senderId:receiverId, receiverId:senderId})

    console.log(Chartapp.getCollection('chart').exists())
    // if(await app.getCollection('chart').exists()){

    // }

}