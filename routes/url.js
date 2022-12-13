const express = require('express');
const routes = express.Router();
const urlController = require('../controller/url');
const {authForURL} = require('../middleware/authcheck');

routes.post('/' ,authForURL, urlController.shortener);
routes.delete('/:id' , authForURL , urlController.delete_Url);
routes.put('/:id' , authForURL , urlController.update_Url);
routes.get('/:id' , authForURL , urlController.findById);
routes.get('/' , authForURL , urlController.getUrl);

module.exports = routes;