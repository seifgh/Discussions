const Room = require("../models/room");

const isRoomCreator = async(roomId, userId) => {
    const roomExists = await Room.exists({ _id: roomId, creator: userId });
    return roomExists;
}

module.exports = async(req, res, next) => {
    try {
        if (await isRoomCreator(req.params.roomId, req.user._id)) {
            return next();
        }
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(404).json({ error: "NOT_FOUND" })
        }
    }
    res.status(401).json({ error: "USER_NOT_CREATOR" });
}