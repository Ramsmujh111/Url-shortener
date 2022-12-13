const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const redirectUrlRoutes = require('./routes/redirect');
const Logger = require('./service/winston');
const urlRoutes = require('./routes/url');
const googleRoutes = require('./routes/google_auth');
const passportSetUp = require('./service/passport');
const passport = require('passport');
const cookiesSession = require('cookie-session');
const NodeScheduler = require('./service/scheduler')
const error_404 = require('./routes/error_404');
const handleFailure = require('./config/handleFailures');
const YAML = require('yamljs');
const swaggerjsdoc = YAML.load('./Openapi.yaml');
const swagger_ui = require("swagger-ui-express");

const app = express();

// Middleware for the ejs
app.set('view engine' , 'ejs');
// body parser
app.use(express.json());
// start the scheduler
NodeScheduler.Scheduler();
// // doc -implantation's
app.use("/api/docs", swagger_ui.serve, swagger_ui.setup(swaggerjsdoc));

// cookie session 
app.use(cookiesSession({
    name: 'session',
    maxAge:20 * 60 * 60 * 1000,
    keys:[process.env.COOKIES_KEY]
}))
// initialize the passport 
app.use(passport.initialize());
// initialize the passport cookies session
app.use(passport.session());

const PORT = process.env.PORT || 3000;
app.use('/Google/auth' , googleRoutes);
// redirect url middleware
app.use('/' , redirectUrlRoutes);
// url shorter middleware
app.use('/api/url',urlRoutes);

// error routes for unknown endpoint
app.use(error_404);


// unhandled rejection 
handleFailure();

mongoose.connect(process.env.MONGO_URL)
.then((result) =>{
    Logger.info(`Data base is connected successfully`);
    app.listen(PORT,()=>{
        Logger.info(`Server is Listing on the PORT=${PORT}`)
    })
})
.catch((err) =>{
    console.log(err.message);
})


