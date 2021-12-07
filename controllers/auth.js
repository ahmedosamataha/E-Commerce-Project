const Consumer = require('../models/consumer');
const Seller = require('../models/seller');

exports.findUser = (req, res, next) => {
    const id = req.cookies.userId;
    const type = req.cookies.userType;
    req.isAllowed = true;   // v3
    if (id && type === 'consumer') {
        Consumer
            .findByPk(id)
            .then(consumer => {
                req.user = consumer;
                req.userType = 'consumer';
                next();
            })
            .catch(err => console.log('findUser', err));
    }
    else if (id && type === 'seller') { //v7
        Seller
            .findByPk(id)
            .then(seller => {
                req.user = seller;
                req.userType = 'seller';
                next();
            })
            .catch(err => console.log('findUser', err));
    } 
    else if (id && type === 'admin') { //v9
        req.user = {};
        req.userType = 'admin';
        next();
    }
    else {
        req.user = null;
        req.userType = 'guest';
        next();
    }
};


exports.signOut = (req, res, next) => {
    res.clearCookie("userId");
    res.clearCookie("userType");
    res.redirect('/');
};

exports.getSignIn = (req, res, next) => {
    if (req.userType !== 'guest') { // v3
        req.isAllowed = false;
        return next();
    }
    res.render('auth/SignInScreen', {   // v3
        userType: req.userType
    });
};

exports.postSignInAdmin = (req, res, next) => {    //v9
    const email = req.body.email;
    const password = req.body.password;
    if (email === 'admin@admin.com' && password === 'admin') {
        res.cookie('userId', 1);
        res.cookie('userType', 'admin');
        res.redirect('/');
    }
    else
        next();
};

exports.postSignInSeller = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Seller
        .findAll({where: {email: email}})
        .then(sellers => {
            const seller = sellers[0];
            if (seller && seller.getPassword() == password) {
                res.cookie('userId', seller.getId());
                res.cookie('userType', 'seller');
                res.redirect('/');
            }
            else {
                next(); //v8
            }
        })
        .catch(err => console.log('postSignIn', err));
};

exports.postSignInConsumer = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Consumer
        .findAll({where: {email: email}})
        .then(consumers => {
            const consumer = consumers[0];
            if (consumer && consumer.getPassword() == password) {
                res.cookie('userId', consumer.getId());
                res.cookie('userType', 'consumer');
                res.redirect('/');
            }
            else {
                res.redirect('/sign-in');
            }
        })
        .catch(err => console.log('postSignIn', err));
};

exports.getSignUp = (req, res, next) => {  //v3
    res.render('auth/RegisterScreen', {
        userType: 'guest',
    })
};

exports.postSignUpSeller = (req, res, next) => {  //v7
    if (req.body.type !== 'seller') return next();
    if (req.body.password !== req.body.repassword) res.redirect('/sign-up');
    Seller
        .create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        })
        .then(() => {
            res.redirect('/sign-in');
        })
        .catch(err => console.log('postSignUpSeller', err));
};

exports.postSignUpConsumer = (req, res, next) => {  //v3
    if (req.body.type !== 'consumer') return next();
    if (req.body.password !== req.body.repassword) res.redirect('/sign-up');
    Consumer
        .create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            shippingAddress: req.body.shippingAddress,
            cash: 0
        })
        .then(consumer => {
            return consumer.createCart();
        })
        .then(() => {
            res.redirect('/sign-in');
        })
        .catch(err => console.log('postSignUpConsumer', err));
};

//exports.postSignUpSeller = (req, res, next) => {}
