const { model, Schema } = require("mongoose");

const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    room: {
        type: Schema.ObjectId,
        ref: 'Room'
    }
}, { timestamps: true });

const Message = model("Message", MessageSchema);
module.exports = Message;