const validUrl = require("valid-url");
const shortId = require("shortid");
const Url = require("../models/Url");
const Logger = require("../service/winston");
const User = require("../models/Users");

/**
 *
 * @param {object} req
 * @param {object} res
 * @route POST /api/url/shorten
 * @desc  Create short URL
 * @returns return the shorted url from long url
 */
exports.shortener = async (req, res) => {
  try {
    const longUrl = req.body.longUrl;
    const baseUrl = process.env.BASE_URL;
    // check base url is valid url
    if (!validUrl.isUri(baseUrl)) {
      Logger.error(`Base url is not valid | ${this.shortener.name}`);
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
    // create url code
    const urlCode = shortId.generate();
    // check long url
    if (validUrl.isUri(longUrl)) {
      let url = await Url.findOne({ longUrl });
      // if url exist in database then return the url
      if (url) {
        Logger.info(`return the existing uri | ${this.shortener.name} `);
        url.expire_at = new Date(
            new Date().setHours(new Date().getHours() + 23)
        );
        await url.save();
        return res.status(200).json({
          status: true,
          url,
        });
      } else {
        const shortUrl = baseUrl + "/" + urlCode;
        // create the new url instances
        // get the user id by the headers
        const idToken = await User.findOne({
          accessToken: req.headers["token"],
        });
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          create_At: new Date(),
          expire_at: new Date(
            new Date().setHours(new Date().getHours() + 23)
          ),
          user: idToken._id,
        });
        // now save the instances in database
        await url.save();
        Logger.info(`save the url in database | ${this.shortener.name}`);
        res.status(200).json({
          status: true,
          message: "Create new Instance of URl",
          url,
        });
      }
    }
  } catch (error) {
    Logger.error(error.message);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @description user find by url code and delete && find by id and deleted
 * @param {object} req
 * @param {object} res
 * @param {string} urlCode url shouter url code
 * @param {string} id url shortener id find by id and delete the url
 * @return message url has been deleted
 */
exports.delete_Url = async (req, res) => {
  try {
    const url_code = req.query.code;
    const url = url_code
      ? await Url.findOneAndDelete({ urlCode: url_code })
      : await Url.findByIdAndRemove(req.params.id);
    // check if url is exist
    if (!url) {
      Logger.error(`Url code or id does not match | ${this.delete_Url.name}`);
      return res.status(404).json({
        status: false,
        message: "Url code or id does not match",
      });
    }
    Logger.info(`Url successfully deleted`);
    res.status(200).json({
      status: true,
      message: `Url successfully deleted`,
    });
  } catch (error) {
    Logger.error(`${error.message} | ${this.delete_Url.name}`);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @description find by id and update the url
 * @param {object} req
 * @param {object} res
 * @param {string} id find by params id and update the existing url shortener
 * @return return the updated url shortener
 */

exports.update_Url = async (req, res) => {
  try {
    // extract data from the params id
    const paramsId = req.params.id;
    const updatedUrl = await Url.findByIdAndUpdate(
        paramsId,
      {
        $set: req.body,
      },
      { new: true }
    );
    // if url id does not match or something return error
    if(!updatedUrl){
        Logger.error(`user id does not match with existing data | ${this.update_Url.name}`);
        return res.status(404).json({
            status:false,
            message:`user id does not match with database ids`
        })
    }
    // Logger success message
    Logger.info(`url successfully updated`);
    // send the response
    res.status(200).json({
        status:true,
        message:`Url successfully updated`,
        updatedUrl
    })
  } catch (error) {
     Logger.error(`${error.message} | ${this.update_Url.name}`);
     res.status(500).json({
        status:false,
        message:error.message
     })
  }
};
/**
 * @description find the all url which is created by one user
 * @param {object} req
 * @param {object} res
 * @return all url shortener created by one users
 */
exports.getUrl = async (req, res) =>{
    try {
        const allUrl = await Url.find({user:req.params.id});
        console.log(req.params.id);
        // check if userId is does not exist
        if(!allUrl){
            Logger.error(`User id does not match | ${this.getUrl.name}`);
            return res.status(404).json({
                status:false,
                message:`User id does not exist`
            })
        }
        Logger.info(`get all user url | ${this.getUrl.name}`);
        res.status(200).json({
            status:true,
            message:'all user url',
            allUrl,
        })
    } catch (error) {
        Logger.error(`${error.message} | ${this.getUrl.name}`);
        res.status(500).json({
            status:false,
            message:error.message
        })
        
    }
}
