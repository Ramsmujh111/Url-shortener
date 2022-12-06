const express = require('express');
const routes = express.Router();
const urlController = require('../controller/url');
const {authForURL} = require('../middleware/authcheck');

routes.post('/shorten' ,authForURL, urlController.shortener);
routes.delete('/delete/:id' , authForURL , urlController.delete_Url);
routes.put('/update/:id' , authForURL , urlController.update_Url);
routes.get('/url/:id' , authForURL , urlController.getUrl);

module.exports = routes;