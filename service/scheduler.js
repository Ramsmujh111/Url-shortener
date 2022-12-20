const nodeScheduler = require("node-cron");
const User = require("../models/Users");
const Logger = require("./winston");
const Url = require("../models/Url");
const mailSender = require("../config/mailSender");
/**
 *
 * @param {*} users
 * @description send the email all users one by one
 */
const sendEmailUser = async (userId) => {
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return Logger.error(
        `with this id user does't exist | ${sendEmailUser.name}`
      );
    }
    // set the mail options
    const mailOptions = {
      from: "URL Shortener",
      to: user.email,
      subject: "alert for remove url shortener",
      html: "<p> you url will be removed with in a 1 hour <p>",
    };
    mailSender.sendMail(mailOptions, (err, info) => {
      if (err) {
        return Logger.error(err.message);
      }
      Logger.info(`Email has been send | ${info.messageId}`);
    });
  } catch (error) {
    Logger.error(`${error.message}  | ${sendEmailUser.name}`);
  }
};

/**
 * @descriptions set the scheduler for the mail sender
 */
const Scheduler = () => {
  try {
    // scheduler represent the time Like this -> seconds , minute , hours , day , week 
    // i'll set the cron-job will that be run after the 1 hours 
    // and every hours cron check 
    nodeScheduler.schedule(`0 * */1 * * *`, async () => {
      // find the all user from the database and send the email all off them
      const urlDetails = await Url.find({});
      if (!urlDetails) {
        return Logger.error(`Url Does not founds | ${Scheduler.name}`);
      }
      // check the url expiration time
      const exp_time = urlDetails.map((key) => {
        return {
          expire_at: key.expire_at,
          userId: key.user,
        };
      });
      // set the mail before the 1 hours
      for (let URL_details of exp_time) {
         // create a exp_variable
        const before_exp = new Date(URL_details.expire_at);
        // set the expire time to  before 1 hours 
        before_exp.setHours(before_exp.getHours() - 1);
        
        // send the email before exp time to 1 hours 
        if(before_exp.getHours() <= new Date().getHours() &&  new Date().getHours() <= new Date(URL_details.expire_at).getHours()){
             sendEmailUser(URL_details.userId);
        }
        // after remove url
        if(new Date(URL_details.expire_at).getHours() >= new Date().getHours()){
               RemoveUrl(URL_details.expire_at)
        }

      }
    });
  } catch (error) {
    Logger.error(`Internal server Error | ${Scheduler.name}`);
  }
};

/**
 * @description url remove functionality
 * @param {string} exp_date 
 */
const RemoveUrl = async (exp_date) => {
  try {
    // find the url in data base and remove
    const exp_url = await Url.findOneAndDelete(exp_date);
    if (!exp_url) {
      return Logger.error(`expire url date not match  | ${RemoveUrl.name}`);
    }
    Logger.info(`Url successfully removed`);
  } catch (error) {
    Logger.error(`${error.message}  | ${RemoveUrl.name}`);
  }
};

module.exports = {
  Scheduler,
};
