const Joi = require("joi");

const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(40).optional(),
  phone: Joi.string().allow("").optional()
}).min(1);

module.exports = { updateProfileSchema };
