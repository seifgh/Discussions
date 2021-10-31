const { SECRET_JWT_CODE } = require("../settings");
const { sign, verify } = require("jsonwebtoken");

module.exports = {
    getUserJwt(user) {
        return sign({
                id: user._id,
            },
            SECRET_JWT_CODE, { expiresIn: "60d" }
        );
    },
    getUserIdFromJwt(authToken) {
        return verify(
            authToken.replace("Bearer ", ""),
            SECRET_JWT_CODE
        ).id;
    }
}