const Room = require("../models/room");

const isRoomMember = async(roomId, userId) => {
    const roomExists = await Room.exists({ _id: roomId, members: userId });
    return roomExists;
}

module.exports = async(req, res, next) => {
    try {
        if (await isRoomMember(req.params.roomId, req.user._id)) {
            return next();
        }
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(404).json({ error: "NOT_FOUND" })
        }
    }
    res.status(401).json({ error: "USER_NOT_A_MEMBER" });
}