const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getHome = (req, res, next) => {
    Product
        .findAll()
        .then(products => {
            res.render('shop/HomeScreen', {
                products: products,
                userType: req.userType
            });
        });
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product
        .findByPk(id)
        .then(product => {
                res.render('shop/ProductDetailsScreen', {
                    product: product,
                    userType: req.userType
                });
            });
};

exports.postAddToCart = (req, res, next) => {
    // console.log(req.body.productId, req.body.quantity);
    const productId = req.body.productId;
    let quantity = +req.body.quantity;
    let product;
    let fetchedCart;
    Product 
        .findById(productId)
        .then(prod => {
            product = prod;
            return req.user.getCart();
        })
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: productId}});
        })
        .then(products => {
            if (products.length > 0) {
                product = products[0];
                quantity += +product.getCartItem().getQuantity();
            }
            return fetchedCart.addProduct(product, {through: {quantity: quantity}});
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log('postAddToCart', err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            let check = 0;
            for (let product of products)
                check += product.getPrice() * product.getCartItem().getQuantity();
            res.render('shop/CartScreen', {
                products: products,
                check: check.toFixed(2),
                userType: req.userType
            })
        })
};

exports.deleteProductFromCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            const product = products.filter(p => p.getId() == req.body.productId);
            return product[0].getCartItem().destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log('deleteProductFromCart', err));
};
