const { SECRET_JWT_CODE } = require("../settings");
const jwtVerify = require("jsonwebtoken").verify;
const User = require("../models/user");

module.exports = async(req) => {
    const authToken = req.headers.authorization;
    if (authToken) {
        try {
            const decoded = jwtVerify(
                authToken.replace("Bearer ", ""),
                SECRET_JWT_CODE
            );

            const user = await User.findById(decoded.id, "-password -__v");

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