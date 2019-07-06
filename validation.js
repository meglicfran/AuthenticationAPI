const Joi = require("@hapi/joi");

const registerValidation = data => {
  const Schema = {
    username: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  };
  return Joi.validate(data, Schema);
};

module.exports.registerValidation = registerValidation;
