const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChartSchema = Schema({
    chatKey: {type: String, required: true},
    senderId: {type: String, required: true},
    receiverId: {type: String, required: true},
    message: {type: String},
    time: {type: Date},

}, { timestamps: true });

const Chart = mongoose.model('chart', ChartSchema)
module.exports = Chart;