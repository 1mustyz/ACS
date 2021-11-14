const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = Schema({
    clientId: { type: String, required: true},
    clientLocation: {type: Array},
    alert: {
        on: {type: Boolean},
        riskLevel: {type: String}
    },
    clientActions: [{type: Object}]
}, { timestamps: true });

const Client = mongoose.model('client', ClientSchema)
module.exports = Client;