const Chart = require('../models/chart')

exports.getPrevChart = async (req,res,next) => {
    const {senderId, receiverId} = req.query

    const vokedOne = await Chart.find({senderId,receiverId},{chatKey: 1})
    const vokedTwo = await Chart.find({senderId:receiverId, receiverId:senderId},{chatKey: 1})

    // console.log('///////',vokedOne,vokedTwo)

    let chatKey;

    if(vokedTwo[0].chatKey){

      chatKey = vokedTwo[0].chatKey
      console.log(chatKey)

    }else if(vokedOne[0].chatKey){
        chatKey = vokedOne[0].chatKey
        console.log(chatKey)
      

    }else{
    res.json({success:true, message: []})

    }

    const prevChart = await Chart.find({chatKey}).sort({time:1}).limit(10)
    res.json({success:true, message: prevChart})
    


}