const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionSchema = Schema({
    actionId: {type: String},
    actionName: {type: String},
    actionInfo: {type: String},
    contactList: [{type: Object}]
}, { timestamps: true });

const Action = mongoose.model('action', ActionSchema)
module.exports = Action;