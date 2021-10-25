const { model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // profileImageUrl: {
    //     type: String,
    // },
}, { timestamps: true });

UserSchema.plugin(uniqueValidator);
const User = model("User", UserSchema);
module.exports = User;