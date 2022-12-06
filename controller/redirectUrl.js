const Url = require('../models/Url');
const Logger = require('../service/winston');

exports.home = (req,res) =>{
    res.status(200).json({
        status:true,
        message:'Welcome To Home Routes'
    })
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} code code params is generated randoms uuid
 * @redirect redirect the long url and goes long url page
 * @returns if long url is not valid it's return error 404
 */
exports.redirectUrl = async (req,res) =>{
    try {
        // extract data from the params code
        const urlCode = req.params.code
        const url = await Url.findOne({urlCode:urlCode});
        // check the if url is exist in the database 
        if(url){
            // redirect the longUrl when we hitting the longUrl
            Logger.info('redirect url successfully redirect');
            return res.redirect(url.longUrl);
        }else{
            // return the Error message like url not founds
            Logger.error(`return the error No url founds | ${this.redirectUrl.name}`);
            return res.status(404).json({
                status:false,
                message:`No url founds`
            })
        }
    } catch (error) {
        Logger.error(error.message)
        res.status(500).json({
            status:false,
            message:error.message
        })
        
    }
}