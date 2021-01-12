const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getHome);

router.get('/recommendations', shopController.getRecommendations);  //v4

router.get('/products/:productId', shopController.getProduct);

router.post('/add-to-cart', shopController.postAddToCart);

router.get('/cart', shopController.getCart);

router.post('/delete-product-from-cart', shopController.deleteProductFromCart);

router.get('/consumer-profile/:consumerId', shopController.getProfile); // v2

router.post('/update-profile', shopController.postUpdateProfile); // v2

router.get('/place-order', shopController.getPlaceOrder); // v2

router.post('/place-order', shopController.postPlaceOrder); // v2
router.post('/place-order', shopController.postCreateOrder); // v3

router.post('/search', shopController.postSearch);  //v6

module.exports = router;
