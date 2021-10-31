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
    })),
    updateFullNameValidator: joiValidator(Joi.object({
        fullName: Joi.string().trim().min(2).required(),
        password: Joi.string().min(8).required()
    })),
    updatePasswordValidator: joiValidator(Joi.object({
        newPassword: Joi.string().min(8).required(),
        currentPassword: Joi.string().min(8).required()
    }))
}