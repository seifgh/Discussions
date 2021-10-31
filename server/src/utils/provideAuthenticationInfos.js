const User = require("../models/user");
const { getUserIdFromJwt } = require("./jwt");

module.exports = async(req) => {
    const authToken = req.headers.authorization;
    if (authToken) {
        try {
            const user = await User.findById(getUserIdFromJwt(authToken), "-password -__v");
            if (user) {
                req.user = user;
                req.isAuthenticated = true;
            }
        } catch {
            req.isAuthenticated = false;
        }
    } else {
        req.isAuthenticated = false;
    }
    return req.isAuthenticated;
}