const { model, Schema } = require("mongoose");

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: Schema.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true });

const Room = model("Room", RoomSchema);
module.exports = Room;