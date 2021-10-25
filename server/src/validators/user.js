const Joi = require("joi");
const joiValidator = require("../middlewares/joiValidator");

module.exports = {
    signInValidator: joiValidator(Joi.object({
        email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(8).required()
    })),
    signUpValidator: joiValidator(Joi.object({
        email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(8).required(),
        fullName: Joi.string().trim().min(2).required()
    }))

}