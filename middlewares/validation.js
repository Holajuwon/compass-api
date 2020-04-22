const Joi = require("joi");

module.exports.validatePost = (post) => {
  const schema = {
    author: Joi.string().min(3).max(50),
    content: Joi.string().min(5).required(),
    title: Joi.string().min(5),
    url: Joi.string().uri().optional()
  };
  return Joi.validate(post, schema);
};

module.exports.validatePostUpdate = (post) => {
  const schema = {
    content: Joi.string().min(5).required(),
    author: Joi.string().max(50),
    title: Joi.string(),
    url: Joi.string(),
  };
  return Joi.validate(post, schema);
};

module.exports.validateComment = (post) => {
  const schema = {
    author: Joi.string().min(3).max(50),
    comment: Joi.string().min(5).required(),
  };
  return Joi.validate(post, schema);
};

module.exports.validateCommentUpdate = (post) => {
  const schema = {
    comment: Joi.string().min(5).required(),
    author: Joi.string().max(50),
  };
  return Joi.validate(post, schema);
};
