const express = require('express');
const routes = express.Router();
const error_404Router = require("../controller/error_404");

routes.use(error_404Router.error_404);

module.exports = routes;