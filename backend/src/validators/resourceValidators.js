const Joi = require("joi");

const createResourceSchema = Joi.object({
  gameKey: Joi.string().min(2).max(40).required(),
  title: Joi.string().min(2).max(80).required(),
  notes: Joi.string().allow("").max(1000).optional(),
  score: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid("planned", "playing", "completed").optional()
});

const updateResourceSchema = Joi.object({
  gameKey: Joi.string().min(2).max(40).optional(),
  title: Joi.string().min(2).max(80).optional(),
  notes: Joi.string().allow("").max(1000).optional(),
  score: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid("planned", "playing", "completed").optional()
}).min(1);

module.exports = { createResourceSchema, updateResourceSchema };
