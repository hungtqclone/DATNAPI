const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    id: { type: ObjectId },
    nameProdut: { type: String, require: true },
    status: {type: Boolean},
    detail: { type: String, require: true },
    location: {type: String, require: true},
    price: {type: Number, require: true},
    created_AT: {type: String, require: true},
    file: {type: String, require: true},
    role:{type: String, require: true},
});

module.exports = mongoose.model.product || mongoose.model('product', productSchema);