const Consumer = require('../models/consumer');

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
    res.render('auth/SignInScreen', {
        userType: req.userType
    });
};

exports.postSignInConsumer = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Consumer
        .findAll({where: {email: email}})
        .then(consumers => {
            const consumer = consumers[0];
            // console.log(email, password, consumer);
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

exports.postSignUpConsumer = (req, res, next) => {  //v3
    if (req.body.type !== 'consumer') return next();
    if (req.body.password !== req.body.repassword) res.redirect('/sign-up');
    Consumer
        .create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            shippingAddress: req.body.shippingAddress,
        })
        .then(consumer => {
            return consumer.createCart();
        })
        .then(() => {
            res.redirect('/sign-in');
        })
        .catch(err => console.log('postSignUpConsumer', err));
};
