const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = Schema({
    clientId: { type: String, required: true},
    fullName: { type: String},
    phone: { type: String},
    email: { type: String},
    image: { type: String, default: '1.jpg' },
    clientLocation: {type: String},
    clientActions: [{type: Object}],
    sud: {type: Object, default: null}
}, { timestamps: true });

const Client = mongoose.model('client', ClientSchema)
module.exports = Client;