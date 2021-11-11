const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = Schema({
    clientId: { type: String, required: true},
    clientLocation: {type: Array},
    alert: {
        on: {type: Boolean},
        riskLevel: {type: String}
    },
    clientActions: {type: Array}
}, { timestamps: true });

const Client = model('client', ClientSchema)
module.exports = Client;