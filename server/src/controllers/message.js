const Message = require("../models/message");
const Room = require("../models/room");

const MESSAGES_PAGINATE_BY = 20;

module.exports = {
    async sendMessage(req, res) { // params [roomId]
        const { content } = req.body;
        const { roomId } = req.params;

        try {
            const message = await Message.create({
                content,
                sender: req.user._id,
                room: roomId
            });
            // update room lastMessage and get members
            const { members } = await Room.findOneAndUpdate({ _id: roomId }, {
                lastMessage: message._id
            });
            // send message to each member
            const socketIo = req.app.get("socketIo");
            members.forEach((userId) => {
                socketIo.to(userId.toString())
                    .emit("receive-message", {...message._doc, sender: req.user });
            });
            res.status(201).json({ message });
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: "MONGO", details: err });
        }
    },
    async getRoomMessages(req, res) { // params [roomId], queries: [lastMessageCreationDate]
        const { lastMessageCreationDate } = req.query;
        const roomMessagesFilters = {
            room: req.params.roomId,
            ...(lastMessageCreationDate ? ({
                createdAt: {
                    $lt: new Date(lastMessageCreationDate)
                }
            }) : {})
        }
        const paginatedMessages = await Message.find(roomMessagesFilters)
            .limit(MESSAGES_PAGINATE_BY).sort("-createdAt").populate("sender");
        const hasMoreMessages = await Message.exists({
            ...roomMessagesFilters,
            _id: {
                $nin: paginatedMessages
            }
        });

        res.json({
            messages: paginatedMessages,
            hasMore: hasMoreMessages
        })
    }

}