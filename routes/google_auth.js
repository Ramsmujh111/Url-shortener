const express = require('express');
const routes = express.Router();
const googleController = require('../controller/google_auth');
const passport = require('passport');
const {authCheck} = require('../middleware/authcheck');

routes.get('/home',googleController.HomePage);
routes.get('/login' ,passport.authenticate('google' , {
    scope:['profile' , 'email']
}));
routes.get('/redirect' , passport.authenticate('google') ,googleController.redirect);
routes.get('/profile', authCheck , googleController.profile);
routes.get('/logout' , authCheck,googleController.logout);
module.exports = routes;