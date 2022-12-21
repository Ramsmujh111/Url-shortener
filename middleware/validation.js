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
function isValidURL(string) {
    let url;
    try {
      url = new URL(string);
      if(url.protocol === "http:" || url.protocol === "https:"){
         return {
            longUrl:url.href
         }
      }
    } catch (_) {
      return false;
    }
     
  }

module.exports = {
    ValidateUser,
    validateMongooseObjectId,
    isValidURL,
};
