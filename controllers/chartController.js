const Chart = require('../models/chart')

exports.getPrevChart = async (req,res,next) => {
    const {staffOneId,staffTwoId} = req.query
    const prevChart = await Chart.find({}).sort({time:1}).limit(10)
    res.json({success:true, message: prevChart})
}