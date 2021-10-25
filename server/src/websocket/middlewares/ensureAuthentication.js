module.exports = async(socket, next) => {
    if (socket.request.isAuthenticated) {
        return next();
    }
    next(new Error("UNOTHORIZED"));
}