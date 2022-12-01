const express = require('express');
const routes = express.Router();
const redirectController = require('../controller/redirectUrl');

routes.get('/' ,redirectController.home);
routes.get('/:code' , redirectController.redirectUrl);



module.exports = routes;

