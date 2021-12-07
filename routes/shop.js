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
router.get('/seller-profile/:sellerId', shopController.getProfile); // v7

router.post('/update-profile', shopController.postUpdateProfile); // v2
router.post('/add-cash', shopController.postAddCash);
router.post('/transfer-cash', shopController.postTransferCash)

router.get('/place-order', shopController.getPlaceOrder); // v2

router.post('/place-order', shopController.postPlaceOrder); // v2
router.post('/place-order', shopController.postCreateOrder); // v3

router.post('/search', shopController.postSearch);  //v6

router.get('/create-product', shopController.getCreateProduct); //v7
router.post('/create-product', shopController.postCreateProduct); //v7

router.post('/sellerDeleteTheirProduct', shopController.postDeleteProduct); //v7

router.get('/update-product/:productId', shopController.getUpdateProduct); //v7

router.post('/add-review', shopController.postAddReview); //v8

router.get('/sellers-list', shopController.getUsersList); //v9
router.get('/consumers-list', shopController.getUsersList); //v9
router.post('/delete-user', shopController.postDeleteUser); //v9
router.post('/give-consumer-offer', shopController.postOfferConsumer); //v9

module.exports = router;
