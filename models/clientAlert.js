const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientAlertSchema = Schema({
    clientId: { type: String, required: true},
    clientLocation: {type: String},
    riskLevel: { type: String},
    time: {type: Date},
    respond: { type: Boolean}
}, { timestamps: true });

const ClientAlert = mongoose.model('clientAlert', ClientAlertSchema)
module.exports = ClientAlert;