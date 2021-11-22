const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = Schema({
    clientId: { type: String, required: true},
    fullName: { type: String},
    phone: { type: String},
    clientLocation: {type: String},
    clientActions: [{type: Object}]
}, { timestamps: true });

const Client = mongoose.model('client', ClientSchema)
module.exports = Client;