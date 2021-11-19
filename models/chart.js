const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChartSchema = Schema({
    
    staffOneId: {type: String, required: true},
    staffTwoId: {type: String, required: true},
    message: {type: String},
    senderId: {type: String},
    receiverId: {type: String},
    time: {type: Date},

}, { timestamps: true });

const Chart = mongoose.model('chart', ChartSchema)
module.exports = Chart;