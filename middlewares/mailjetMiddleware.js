
const mailler = (senderMail,senderName,recieverMail,recieverName) =>{

    const mailjet = require ('node-mailjet')
    .connect('7f620890c5b3dc31575ac2b83ad8acdc', '3f4d051f08eb0671c87f66ffa5c4f977')
    return request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": `${senderMail}`,
            "Name": `${senderName}`
          },
          "To": [
            {
              "Email": `${recieverMail}`,
              "Name": `${recieverName}`
            }
          ],
          "Subject": "ACS.",
          "TextPart": "Thank You! for being part of us ",
          "HTMLPart": "<h3>Your password is: `password` ",
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
    
}

module.exports = mailler
