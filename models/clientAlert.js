const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientAlertSchema = Schema({
    clientId: { type: String, required: true},
    clientLocation: {type: String},
    riskLevel: { type: String},
    respond: { type: Boolean}
}, { timestamps: true });

const ClientAlert = mongoose.model('clientAlert', ClientAlertSchema)
module.exports = ClientAlert;