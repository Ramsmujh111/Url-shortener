const Joi  = require('joi');

// user schema validation 
const ValidateUser = Joi.object({
    userName:Joi.string().alphanum().min(3).max(30).required(),
    googleId:Joi.string().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})

const validateMongooseObjectId = (parameter) =>{
    return Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "Valid Id")
      .validate(parameter);
}

module.exports = {
    ValidateUser,
    validateMongooseObjectId,
};
