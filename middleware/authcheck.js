const User = require('../models/Users');
const Logger = require('../service/winston');
// check if user is logging 

const authCheck = async (req, res , next) =>{
    if(!req.user){
        // if user is not logged in 
        res.redirect('/google/auth/login');
    }else{
        // if logged in 
        next();

    }
}

// middleware for url shortener
const authForURL = async (req, res, next) =>{
      try {
        const token = req.headers["token"];
        // check if user pass the null token
        if(!token){
            return res.status(401).json({
                status:false,
                message:'Token does not exist'
            })
        }
        // check is match is user token
        const tokenExist = await User.findOne({accessToken:token})
        if(!tokenExist){
            Logger.error(`Unauthorize | ${req.url} | ${authForURL.name}`);
            return res.status(401).json({
                status:false,
                message:'Unauthorize'
            })
        }
        next();
      } catch (error) {
        Logger.error(error.message);
        res.status(500).json({
            status:false,
            message:'Internal server Error'
        })
        
      }
      
}

module.exports = {
    authCheck,
    authForURL
}