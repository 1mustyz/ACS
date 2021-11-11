const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionSchema = Schema({
    actionId: {type: String},
    actionName: {type: String}
}, { timestamps: true });

const Action = model('action', ActionSchema)
module.exports = Action;