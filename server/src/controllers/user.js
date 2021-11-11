const Bcrypt = require("bcryptjs");
// -----------------
const User = require("../models/user");
const { getUserJwt } = require("../utils/jwt");
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

        res.json({
            user: formatUserResponse(user),
            authToken: getUserJwt(user)
        })
    },

    async signUp(req, res) {
        try {
            const user = await User.create({...req.body, password: Bcrypt.hashSync(req.body.password) });
            res.status(201).json({
                user: formatUserResponse(user),
                authToken: getUserJwt(user)
            });
        } catch (err) {
            if (err.errors.email) {
                return res.status(400).json({ error: "EMAIL_EXISTS" })
            }
            res.status(400).json({ error: "MONGO", details: err });
        }
    },

    async getUser(req, res) {
        return res.json({ user: formatUserResponse(req.user) });
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
    },

    async updateFullName(req, res) {
        const { fullName, password } = req.body;
        const user = await User.findOne(req.user._id);

        if (!Bcrypt.compareSync(password, user.password))
            return res.status(400).json({ error: "WRONG_PASSWORD" });

        user.fullName = fullName;
        try {
            await user.save();
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: "MONGO", details: err });
        }
    },

    async updatePassword(req, res) {
        const { newPassword, currentPassword } = req.body;
        const user = await User.findOne(req.user._id);
        console.log(user._document);
        if (!Bcrypt.compareSync(currentPassword, user.password))
            return res.status(400).json({ error: "WRONG_PASSWORD" });

        user.password = Bcrypt.hashSync(newPassword);
        try {
            await user.save();
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: "MONGO", details: err });
        }
    }
}