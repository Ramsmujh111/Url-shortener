const validUrl = require('valid-url');
const shortId = require('shortid');
const Url = require('../models/Url');
const Logger = require('../service/winston');
const User = require('../models/Users');

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @route POST /api/url/shorten
 * @desc  Create short URL
 * @returns return the shorted url from long url
 */
exports.shortener = async (req, res) =>{
    try {
        const longUrl = req.body.longUrl;
        const baseUrl = process.env.BASE_URL;
        // check base url is valid url 
        if(!validUrl.isUri(baseUrl)){
            Logger.error(`Base url is not valid`)
            return res.status(401).json({
                status:false,
                message:'Unauthorized'
            })
        }
        // create url code
        const urlCode  = shortId.generate()
        // check long url
        if(validUrl.isUri(longUrl)){
            let url = await Url.findOne({longUrl});
            // if url exist in database then return the url 
            if(url){
                Logger.info('return the existing uri')
                return res.status(200).json({
                    status:true,
                    url,
                })
            }
            else{
                const shortUrl = baseUrl + '/' + urlCode;
                // create the new url instances
                // get the user id by the session 
               const idToken = await User.findOne({accessToken:req.headers["token"]})
                url  = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    create_At: new Date(),
                    user:idToken._id
                })
                // now save the instances in database
                await url.save();
                Logger.info(`save the url in database`)
                res.status(200).json({
                    status:true,
                    message:'Create new Instance of URl',
                    url
                })

            }
        }
    } catch (error) {
        Logger.error(error.message);
        res.status(500).json({
            status:false,
            message:error.message
        })
        
    }

}
