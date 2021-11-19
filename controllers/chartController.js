const Chart = require('../models/chart')

exports.getPrevChart = async (req,res,next) => {
    const {staffOneId,staffTwoId} = req.query
    const prevChart = await Chart.find({staffOneId,staffTwoId})
    res.json({success:true, message: prevChart})
}