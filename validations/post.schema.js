const joi = require('joi');

const createPostSchema = joi.object({
  title: joi.string().required().error(new Error('Title is required')),
  description: joi.string().required().error(new Error('Description is required')),
});

module.exports = { createPostSchema };
