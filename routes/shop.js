const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getHome);

router.get('/products/:productId', shopController.getProduct);

router.post('/add-to-cart', shopController.postAddToCart);

router.get('/cart', shopController.getCart);

router.post('/delete-product-from-cart', shopController.deleteProductFromCart);

// router.get('/sign-in', shopController.getHome);

module.exports = router;
