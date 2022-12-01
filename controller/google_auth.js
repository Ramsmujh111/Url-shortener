const User = require('../models/Users');
const Logger = require('../service/winston');

exports.HomePage = async (req, res) =>{
    res.render('login');
}

exports.login  = async (req, res) =>{
    res.render('login')
}

exports.redirect = async (req, res) =>{
  res.redirect('/Google/auth/profile/');
}

exports.profile = async (req, res) =>{
    res.render('profile' , {user:req.user});
}

exports.logOut = async (req, res) => {
    try {
        let userId = JSON.parse(JSON.stringify(req.session));
        const userFindById = await User.findById(userId.passport.user);
        if(!userFindById){
           return Logger.error(`user does not exist by this id | ${req.url} | logOut`)
        }
        userFindById.accessToken=null;
        await userFindById.save();
        req.logOut();
        res.redirect('/google/auth/home/')
    } catch (error) {
        Logger.error(error.message+`| ${req.url} | ${this.logOut.name}`)
    }
}