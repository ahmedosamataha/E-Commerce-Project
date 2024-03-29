const Product = require('../models/product');
const Cart = require('../models/cart');
const Consumer = require('../models/consumer'); //v5
const Seller = require('../models/seller'); //v9
const ConsumerData = require('../database/tables/consumer');

const { Op } = require("sequelize"); //v6

exports.getHome = (req, res, next) => {

    Product
        .findAll()
        .then(products => {
            res.render('shop/HomeScreen', {
                products: products,
                userType: req.userType,
                user: req.user // add user
            });
        })
        .catch(err => console.log('getHome', err)); // catch
};

exports.getRecommendations = (req, res, next) => { //v3
    if (req.userType !== 'consumer') {
        req.isAllowed = false;
        return next();
    }
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
            let ordered = new Object();
            for (let order of orders) 
                for (let product of order.getProducts()) 
                    if (ordered[product.getTag()] )
                        ordered[product.getTag()] += product.getOrderItem().getQuantity();
                    else
                        ordered[product.getTag()] = product.getOrderItem().getQuantity();
            let fav = "", favCount = 0;
            for (let key in ordered) 
                if (favCount < ordered[key]) {
                    fav = key;
                    favCount = ordered[key];
                }
            return Product.findAll({where: {tag: [fav, req.user.getLastVisited()]}});
        })
        .then(products => {
            res.render('shop/HomeScreen', {
                products: products,
                userType: req.userType,
                user: req.user, // add user,
                isRecommendation: true
            });
        })
        .catch(err => console.log('getHome', err)); // catch
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    let fetchedProduct;   //v8
    let reviews;   //v8
    let reviewAverage = 0;
    Product
        .findByPk(id)
        .then(product => {
            fetchedProduct = product;
            if (product)
                return product.getReviews();
            else
                return [];
        })
        .then(theReviews => {
            reviews = theReviews;
            for (let review of reviews)
                reviewAverage += +review.getRate();
            if (reviews.length)
                reviewAverage /= reviews.length;
            if (req.userType === 'consumer') {  //v4
                // console.log('adding lastVidited')
                req.user.setLastVisited(fetchedProduct.getTag());   //v8
                return req.user.save();
            }
            return;
        })
        .then(() => {
            return res.render('shop/ProductDetailsScreen', {
                product: fetchedProduct,    //v8
                reviews: reviews,   //v8
                userType: req.userType,
                user: req.user, // add user
                reviewAverage: reviewAverage
            });
        })
        .catch(err => console.log('getProduct', err));
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
    if (req.userType !== 'consumer') { // v3
        req.isAllowed = false;
        return next();
    }
    let check = 0;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/CartScreen', {
                products: products,
                check: Product.getCheck(products).toFixed(2), // v2
                userType: req.userType,
                user: req.user // add user
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

exports.getProfile = (req, res, next) => {  //v2
    if (req.userType === 'guest') { // v3
        req.isAllowed = false;
        return next();
    }
    if (req.userType === 'consumer') {
        req.user
            .getOrders({ include: ['products']})
            .then(orders => {
                res.render('shop/ProfileScreen', {
                    user: req.user,
                    userType: req.userType,
                    orders: orders
                })
            })
            .catch(err => console.log('getProfile', err));
    }
    else if (req.userType === 'seller') {   //v7
        req.user
            .getProducts()
            .then(products => {
                res.render('shop/ProfileScreen', {
                    user: req.user,
                    userType: req.userType,
                    products: products
                })
            })
            .catch(err => console.log('getProfile', err));
    }
};

exports.postUpdateProfile = (req, res, next) => {   // v2
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (name.length === 0 || email.length === 0 || password.length === 0) 
        return res.redirect('/consumer-profile/' + req.user.getId());
    req.user.setName(name);
    req.user.setEmail(email);
    req.user.setPassword(password);
    req.user
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log('postUpdateProfile', err));
};

exports.getPlaceOrder = (req, res, next) => { //v2
    if (req.userType !== 'consumer') { // v3
        req.isAllowed = false;
        return next();
    }
    let check = 0;
    let offer = 0; //v8
    req.user
        .getOffer()
        .then(theOffer => {
            if (theOffer)
                offer = theOffer.getQuantity();
            return req.user.getCart();
        })
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            const check = +Product.getCheck(products).toFixed(2);
            const orderTotal = ((check+10) * (100-offer) / 100).toFixed(2);
            // console.log("the order", orderTotal);
            res.render('shop/PlaceOrderScreen', {
                products: products,
                user: req.user,
                userType: req.userType,
                offer: offer,
                check: check,
                orderTotal:orderTotal
            })
        })
        .catch(err => console.log('getPlaceOrder', err));
};

exports.postPlaceOrder = (req, res, next) => {  //v2 //v3
    req.user
        .getCart()
        .then(cart => {
            req.fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            req.fetchedProducts = products;
            for (let product of products) // check there is enough of the product in the stock
                if (product.getCartItem().getQuantity() > product.getQuantity()) 
                    return null; //v5 res.redirect('/cart');
            if (req.body.email === req.user.getEmail())//v5
                return [req.user];
            return  Consumer.findAll({where: {email: req.body.email }}); 
        })
        .then(reciever => {
            if (reciever && reciever.length > 0) {
                req.orderReciever = reciever[0];
                return next();
            }
            else {
                return res.redirect('/cart');
            }
        })
        .catch(err => console.log('postPlaceOrder', err));
}

exports.postCreateOrder = (req, res, next) => { // v3 called only if there is enough items in the stock
    const fetchedProducts = req.fetchedProducts;
    const fetchedCart = req.fetchedCart;

    const currencyFactor = {    //v4
        '$': 1,
        'LE': 16,
        '€': 0.7
    };
    let createdOrder;
    req.orderReciever   //v5
        .createOrder()
        .then((order) => {
            createdOrder = order;
            return order.addProducts(fetchedProducts, {through: {discount: 10}})
        })
        .then(() => {
            const check = +Product.getCheck(fetchedProducts).toFixed(2);
            const total = check*1 + 10;
            if(total < Number(req.user.getCash())) {    
                //const orderTotal = ((check+10) * (100-offer) / 100).toFixed(2);
                const currentCash = req.user.getCash() - total;
                req.user.setCash(currentCash);
                req.user.save();
                for (let product of fetchedProducts) { //delete the bought items from the stock
                    product.setQuantity(product.getQuantity() - product.getCartItem().getQuantity());
                }
                return fetchedProducts.map(product => product.save())
            }
            else {
                res.redirect('/place-order');
            }
        
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            return createdOrder.getProducts();
        })
        .then(products => {
            res.render('shop/OrderPlacedScreen', {
                user: req.user,
                userType: req.userType,
                offer: req.body.offer,
                orderTotal: (req.body.orderTotal * currencyFactor[req.body.currency]).toFixed(2), //v5
                currency: req.body.currency,
                products: products,
                orderId: createdOrder.getId(),
                paymentMethod: req.body.paymentMethod, // v5
                reciever: req.orderReciever // v5
            });
        })
        .catch(err => console.log('createOrder', err));
};

exports.postSearch = (req, res, next) => {  //v6
    Product
        .findAll({where: { [Op.or]: [
                {description: {
                    [Op.substring]: req.body.keyword
                }},
                {name: {
                    [Op.substring]: req.body.keyword
                }},
                {tag: {
                    [Op.substring]: req.body.keyword
                }}
            ]
        }})
        .then(products => {
            res.render('shop/HomeScreen', {
                products: products,
                userType: req.userType,
                user: req.user, // add user,
                keyword: req.body.keyword
            });
        })
        .catch(err => console.log('getHome', err)); // catch
}

exports.getCreateProduct = (req, res, next) => {    //v7
    if (req.userType !== 'seller') {
        req.isAllowed = false;
        next();
    }
    res.render('shop/CreateProductScreen', {
        user: req.user,
        userType: req.userType
    });
}

exports.postCreateProduct = (req, res, next) => {    //v7
    
    if (req.userType !== 'seller') {
        req.isAllowed = false;
        next();
    }
    if (req.body.id) {
        Product
            .findByPk(req.body.id)
            .then(product => {
                product.setName(req.body.name);
                product.setTag(req.body.tag);
                product.setDescription(req.body.description);
                product.setImageUrl(req.body.imageUrl);
                product.setQuantity(req.body.quantity);
                product.setPrice(req.body.price);
                return product.save();
            })
            .then((result) => {
                res.redirect('/');
            })
            .catch(err => console.log('postCreateProduct', err));
    } else {
        
        req.user
            .createProduct({
                name: req.body.name,
                tag: req.body.tag,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                quantity: req.body.quantity,
                price: req.body.price,
            })
            .then(() => {
                res.redirect('/');
            })
            .catch(err => console.log('postCreateProduct', err));
    }
}

exports.postDeleteProduct = (req, res, next) => {   //v7
    Product
        .findById(req.body.productId)
        .then(product => {
            if (product)
                return product.destroy();
            return;
        })
        .then(() => {
            if (req.userType === 'seller')
                res.redirect('/seller-profile/' + req.user.getId());
            else
                res.redirect('/');
        })
        .catch(err => console.log('postDeleteProduct', err));
}

exports.getUpdateProduct = (req, res, next) => {
    Product
        .findById(req.params.productId)
        .then(product => {
            res.render('shop/CreateProductScreen', {
                user: req.user,
                userType: req.userType,
                product: product
            })
        })
}

exports.postAddReview = (req, res, next) => {   //v8
    Product
        .findById(req.body.productId)
        .then(product => {
            return product.createReview({
                consumerName: req.user.getName(),
                text: req.body.text,
                rate: req.body.rate
            })
        })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.log('postAddReview', err));
}

exports.getUsersList = (req, res, next) => {  //v9
    const Users = (req.path === '/sellers-list' ? Seller : Consumer);
    Users.findAll()
        .then(users => {
            res.render('shop/UsersListScreen', {
                user: req.user,
                userType: req.userType,
                users: users,
                usersType: (req.path === '/sellers-list' ? 'seller' : 'consumer')
            })
        })
}

exports.postDeleteUser = (req, res, next) => {  //v9
    const Users = (req.body.userType === 'seller' ? Seller : Consumer);
    Users.findById(req.body.userId)
        .then(user => {
            return user.destroy();
        })
        .then(() => {
            res.redirect('/')
        })
}

exports.postOfferConsumer = (req, res, next) => {  //v9
    Consumer
        .findById(req.body.userId)
        .then(consumer => {
            return consumer.createOffer({
                quantity: req.body.quantity
            })
        })
        .then(() => {
            res.redirect('/consumers-list')
        })
}


exports.postAddCash = (req, res, next) => {

    const currentCash =  Number(req.user.getCash()) +  Number(req.body.cash);
    
    req.user.setCash(currentCash);
    req.user.save();
    res.redirect('/consumer-profile/' + req.user.getId());
}

exports.postTransferCash = (req,res,next) => {
    const targetAcc = req.body.targetEmail;
    let targetGlobal
    let targetCurrentCash;
    Consumer.findAll({where: {email: targetAcc}})
        .then(target =>{
            targetGlobal = target[0];
            return target[0].getCash();
        })
        .then(result =>{
            //targetCurrentCash = Number(result);
            targetGlobal.setCash(Number(result) + Number(req.body.cashTransfer));
            targetGlobal.save();
            return req.user.getCash();
        })
        .then(result => {
            req.user.setCash(Number(result) - Number(req.body.cashTransfer));
            return req.user.save();
        })
        .then(()=>{
            res.redirect('/consumer-profile/' + req.user.getId());
        })
        .catch(err => {
            console.log(err);
        });

    //req.body.setCash();
}

exports.getReport = (req,res,next)=>{
    if (req.userType === 'consumer') {
        req.user
            .getOrders({ include: ['products']})
            .then(orders => {
                res.render('shop/Report', {
                    user: req.user,
                    userType: req.userType,
                    orders: orders
                })
            })
            .catch(err => console.log('getProfile', err));
    }
    else if (req.userType === 'seller') {   //v7
        req.user
            .getProducts()
            .then(products => {
                res.render('shop/Report', {
                    user: req.user,
                    userType: req.userType,
                    products: products
                })
            })
            .catch(err => console.log('getProfile', err));
    }

}