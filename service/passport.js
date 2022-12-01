const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/Users')
const Logger = require('./winston');

// serializeUser 
// this is the functions that can be take peace of information from our records then passing it on to stuff in a cookies
passport.serializeUser((user , done) =>{
    done(null , user.id);
})
// deserializeUser
// which when the cookies comes back to us in the server when a browser makes a request for the profile page
// where we're going received the id and going to deserialize it so that we can grab a user from that id 
passport.deserializeUser(async(id , done) =>{
    const existUsers = await User.findById(id);
    if(!existUsers){
       return Logger.error(`Id does not exist`)
    }
    done(null , existUsers)
})

passport.use(
  new GoogleStrategy({
    // options for the
    callbackURL:process.env.REDIRECT_URI,
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    
  },async (accessToken , refreshToken , profile , done) =>{
    // passport callback functions
    console.log(accessToken , refreshToken);
   try {
    // check if user already exists in our db
    const existUser = await User.findOne({googleId:profile.id})
    if(existUser){
        Logger.info('user is \n');
        // update the token 
        existUser.accessToken = accessToken;
        existUser.save();
        return done(null , existUser);
    }
    // create the models instances
    let newUser = new User({
        userName:profile.displayName,
        googleId:profile.id,
        email:profile.emails[0].value,
        photoURl:profile.photos[0].value,
        accessToken,
    })
    // save the data in database 
    if(await newUser.save()){
        console.log({
            message:'new user created',
            newUser,
        });
        done(null , newUser);
    }else{
        Logger.error(`database creation error`);
    }  
   } catch (error) {
      Logger.error(error.message);  
      console.log('error is here');
   }
  })
)
