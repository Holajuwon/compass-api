const Joi = require("joi");
const uuidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

module.exports.isValidUuid = (value) =>
  typeof value === "string" && uuidPattern.test(value);

module.exports.validatePost = (post) => {
  const schema = {
    author: Joi.string().min(3).max(50),
    content: Joi.string().min(5).required(),
    title: Joi.string().min(5),
    url: Joi.string().uri().optional()
  };
  return Joi.object(schema).validate(post);
};

module.exports.validatePostUpdate = (post) => {
  const schema = {
    content: Joi.string().min(5).required(),
    author: Joi.string().max(50),
    title: Joi.string(),
    url: Joi.string(),
  };
  return Joi.object(schema).validate(post);
};

module.exports.validateComment = (post) => {
  const schema = {
    author: Joi.string().min(3).max(50),
    comment: Joi.string().min(5).required(),
  };
  return Joi.object(schema).validate(post);
};

module.exports.validateCommentUpdate = (post) => {
  const schema = {
    comment: Joi.string().min(5).required(),
    author: Joi.string().max(50),
  };
  return Joi.object(schema).validate(post);
};
