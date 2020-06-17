const express = require('express');
const routes = express.Router();


const ProductController = require('../controllers/Product.controller')

routes.get('/',ProductController.getAllProducts)

routes.post('/',ProductController.createNewProduct)

routes.get('/:id',ProductController.searchSingleProduct)

routes.patch('/:id',ProductController.updateProduct)

routes.delete('/:id',ProductController.deleteProduct)

module.exports = routes;