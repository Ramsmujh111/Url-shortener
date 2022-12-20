const Joi  = require('joi');

// user schema validation 
const ValidateUser = Joi.object({
    userName:Joi.string().alphanum().min(3).max(30).required(),
    googleId:Joi.string().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})
// validate MongooseObject id
const validateMongooseObjectId = (parameter) =>{
    return Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "Valid Id")
      .validate(parameter);
}

// validate the url 
function isValidURL(validatedUrl) {
    if(/^(http(s)|http:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(validatedUrl)) {
         return {
            longUrl:validatedUrl
         };
     } else {
         return false;
     }
 }

module.exports = {
    ValidateUser,
    validateMongooseObjectId,
    isValidURL,
};
