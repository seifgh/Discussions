const { Router } = require("express");
const { signInValidator, signUpValidator } = require("./validators/user");
const { signIn, signUp, getUser, searchUsers } = require("./controllers/user");
const ensureAuthentication = require("./middlewares/ensureAuthentication");
const { createRoom, getUserRooms, getRoomDetails, deleteRoom, updateRoomMembers } = require("./controllers/room");
const ensureRoomMember = require("./middlewares/ensureRoomMember");
const ensureRoomCreator = require("./middlewares/ensureRoomCreator");
const { createRoomValidator } = require("./validators/room");
const { sendMessage, getRoomMessages } = require("./controllers/message");
const { sendMessageValidator } = require("./validators/message");
// -------------------------
const userRouter = Router();
userRouter.post("/sign-in", signInValidator, signIn);
userRouter.post("/sign-up", signUpValidator, signUp);
userRouter.get("/get", ensureAuthentication, getUser)
userRouter.post("/search", ensureAuthentication, searchUsers);
// -------------------------
const roomRouter = Router();
roomRouter.use(ensureAuthentication);
roomRouter.post("/create", createRoomValidator, createRoom);
roomRouter.get("/user-rooms", getUserRooms);
roomRouter.get("/details/:roomId", ensureRoomMember, getRoomDetails);
roomRouter.delete("/delete/:roomId", ensureRoomCreator, deleteRoom);
roomRouter.put("/update/members/:roomId", ensureRoomMember, updateRoomMembers)
    // -------------------------
const messageRouter = Router();
messageRouter.post("/send/:roomId", ensureAuthentication, ensureRoomMember, sendMessageValidator, sendMessage);
messageRouter.get("/room/:roomId", ensureAuthentication, ensureRoomMember, getRoomMessages);


module.exports = [
    { path: "/user", router: userRouter },
    { path: "/room", router: roomRouter },
    { path: "/message", router: messageRouter },
];