const Room = require("../models/room");


module.exports = {
    async createRoom(req, res) {
        const { name, members = [] } = req.body;
        members.push(req.user._id.toString());
        console.log({ members });

        try {
            const room = await Room.create({ name, members, creator: req.user._id });

            // send room to each member
            const socketIo = req.app.get("socketIo");
            members.forEach((userId) => {
                socketIo.to(userId.toString()).emit("new-room-created", {
                    _id: room._id,
                    name: room.name,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt,
                    creator: req.user
                });
            });

            return res.status(201).json({
                room
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "MONGO", details: err });
        }
    },
    async getUserRooms(req, res) {
        const rooms = await Room.find({ members: req.user._id }).select(["_id", "name", "lastMessage", "updatedAt"])
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "-password"
                },
            }).sort("-updatedAt");
        res.json({ rooms });
    },
    async getRoomDetails(req, res) { // params [roomId]
        const room = await Room.findById(req.params.roomId).populate({
            path: "members",
            select: "-password"
        }).populate({
            path: "creator",
            select: "-password"
        });
        res.json(room);
    },
    async deleteRoom(req, res) { // params [roomId]
        try {
            const room = await Room.findByIdAndDelete(req.params.roomId);
            // send deleted room to each member
            const socketIo = req.app.get("socketIo");
            room.members.forEach((userId) => {
                socketIo.to(userId.toString()).emit("room-deleted", room);
            });
            res.status(204).send({});
        } catch (err) {
            res.status(400).json({ error: "MONGO", details: err });
        }
    },
    async updateRoomMembers(req, res) { // params [roomId]
        const { removedMembers = [], newMembers = [] } = req.body;
        try {
            let room = await Room.findById(req.params.roomId);
            if (removedMembers.includes(room.creator.toString())) {
                return res.status(400).json({
                    error: "UNOTHORIZED_OPERATION"
                })
            }
            const oldMembers = room.members.map((_id) => _id.toString());
            const updatedMembers = [
                ...oldMembers.filter((id) => !removedMembers.includes(id.toString())),
                ...newMembers
            ];
            room.members = [...updatedMembers];
            await room.save();
            // send updates to old members
            room = await Room.findById(req.params.roomId).populate({
                path: "members",
                select: "-password"
            }).populate({
                path: "creator",
                select: "-password"
            }).populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "-password"
                },
            });
            const socketIo = req.app.get("socketIo");
            const socketMsg = {
                updatedBy: req.user,
                room
            };
            ([...oldMembers, ...newMembers]).forEach((userId) => {
                socketIo.to(userId.toString()).emit("room-members-updated", socketMsg);
            });
            res.json({ updatedRoom: room });
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "MONGO", details: err });
        }

    }
}