const express = require('express');
const routes = express.Router();
const urlController = require('../controller/url');
const {authForURL} = require('../middleware/authcheck');

routes.post('/shorten' ,authForURL, urlController.shortener);

module.exports = routes;