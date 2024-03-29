const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const messageSchema = new mongoose.Schema({
    id: { type: ObjectId },
    senderId: { type: ObjectId, ref: 'user' },
    receiverId: { type: ObjectId, ref: 'user' },
    content: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }

});

module.exports = mongoose.model.message || mongoose.model('message', messageSchema);