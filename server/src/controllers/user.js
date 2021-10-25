const Bcrypt = require("bcryptjs");
const jwtSign = require("jsonwebtoken").sign;
// -----------------
const { SECRET_JWT_CODE } = require("../settings");
const User = require("../models/user");
// --------------------------------

const SEARCH_USERS_LIMIT = 10;

// -----------------------
function formatUserResponse(user) {
    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
    }
}


module.exports = {
    async signIn(req, res) {
        const { password, email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: "USER_NOT_FOUND" });
        if (!Bcrypt.compareSync(password, user.password))
            return res.status(400).json({ error: "WRONG_PASSWORD" });

        const authToken = jwtSign({
                id: user._id,
            },
            SECRET_JWT_CODE, { expiresIn: "60d" }
        );
        res.json({
            user: formatUserResponse(user),
            authToken
        })
    },

    async signUp(req, res) {
        req.body.password = Bcrypt.hashSync(req.body.password);
        try {
            const user = await User.create(req.body);
            const authToken = jwtSign({
                    id: user._id,
                },
                SECRET_JWT_CODE, { expiresIn: "60d" }
            );
            res.status(201).json({
                user: formatUserResponse(user),
                authToken
            });
        } catch (err) {
            if (err.errors.email) {
                return res.status(400).json({ error: "EMAIL_EXISTS" })
            }
            res.status(400).json({ error: "MONGO", details: err });
        }
    },

    async getUser(req, res) {
        return res.json({ user: req.user });
    },

    async searchUsers(req, res) { // params: [searchKey]
        const { searchKey, excludedUsers = [] } = req.body;
        excludedUsers.push(req.user._id);
        const foundUsers = await User.find({
            $or: [
                { email: { $regex: searchKey } },
                { fullName: { $regex: searchKey, $options: "i" } }
            ],
            _id: { $nin: excludedUsers },

        }).limit(SEARCH_USERS_LIMIT);
        res.json({ foundUsers });
    }
}