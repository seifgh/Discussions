const Joi = require("joi");
const joiValidator = require("../middlewares/joiValidator");

module.exports = {
    sendMessageValidator: joiValidator(Joi.object({
        content: Joi.string().required()
    })),
}