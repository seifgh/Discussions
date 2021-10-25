const Joi = require("joi");
const joiValidator = require("../middlewares/joiValidator");
const Room = require("../models/room");

module.exports = {
    createRoomValidator: joiValidator(Joi.object({
        name: Joi.string().trim().min(2).required(),
        members: Joi.array().items(Joi.string().required())
    })),
}