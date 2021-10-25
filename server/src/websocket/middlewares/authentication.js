const provideAuthenticationInfos = require("../../utils/provideAuthenticationInfos")

module.exports = async(socket, next) => {
    await provideAuthenticationInfos(socket.request);
    next();
}