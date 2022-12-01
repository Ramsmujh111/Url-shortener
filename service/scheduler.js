const nodeScheduler = require('node-cron');
const User = require('../models/Users');
const Logger = require('./winston');
const Url = require('../models/Url');
const mailSender = require('../config/mailSender');
/**
 * 
 * @param {*} users 
 * @description send the email all users one by one
 */
const configEmail = async (users) =>{
     try {
        users.forEach((email) =>{
            const mailOptions = {
                from:'URL Shortener',
                to:email,
                subject:'alert for remove url shortener',
                html:'<p> you url will be removed with in a 1 hour <p>'
            }
            mailSender.sendMail(mailOptions  , (err , info)=>{
                if(err){
                   return Logger.error(`${err.message} | configEmail`);
                }
            });
        } )
        Logger.info(`mail has been send`);
     } catch (error) {
        Logger.error(`${error.message} | ${configEmail.name}`);
        
     }
}

/**
 * @descriptions set the scheduler for the mail sender
 */
const sendMailAllUser = () =>{
    try {
        nodeScheduler.schedule(`1 * */22 * * *` , async ()=>{
            // find the all user from the database and send the email all off them
            const usersData = await User.find({})
            if(!usersData){
                return Logger.error(`Users Does not founds | ${sendMailAllUser.name}`);
            }
            // create the empty array for store the all users email
            let email = [];
            usersData.map((key) => {
               email.push(key.email)
            })
            // call the config method
            configEmail(email);
        })
    } catch (error) {
        Logger.error(`Internal server Error | ${sendMailAllUser.name}`);
        
    }
}

const RemoveUrl = () =>{
    nodeScheduler.schedule(`1 * */23 * * *` , async () =>{
        try {
            const url = await Url.deleteMany({});
            console.log(url);
            Logger.info(`Url has been removed`);
            
        } catch (error) {
            Logger.error(`Internal server Error | ${RemoveUrl.name}`)
            
        }
    })
}

module.exports = {
    sendMailAllUser,
    RemoveUrl,
};

