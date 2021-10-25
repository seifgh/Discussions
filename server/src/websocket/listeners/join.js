module.exports = {
    event: "join",
    listener: (socket) => () => {
        const { user } = socket.request;
        console.log(user.fullName + " joined");
        socket.join(user._id.toString());
        socket.emit("joined", user.fullName + " joined");
    }
}