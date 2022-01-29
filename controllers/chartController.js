const Chart = require('../models/chart')

exports.getPrevChart = async (req,res,next) => {
    const {staffOneId, staffTwoId} = req.query

    const vokedOne = await Chart.find({senderId:staffOneId,receiverId:staffTwoId},{chatKey: 1})
    const vokedTwo = await Chart.find({senderId:staffTwoId, receiverId:staffOneId},{chatKey: 1})

    // console.log('///////',vokedOne,vokedTwo)

    let chatKey;

    console.log(vokedTwo)
    if(vokedTwo.length > 0){

      chatKey = vokedTwo[0].chatKey

    }else if(vokedOne.length > 0){
        chatKey = vokedOne[0].chatKey
        console.log(chatKey)
      

    }else{
    res.json({success:true, message: []})

    }

    const prevChart = await Chart.find({chatKey}).sort({time:1})
    res.json({success:true, message: prevChart})
    


}