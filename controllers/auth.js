const Consumer = require('../models/consumer');

exports.findUser = (req, res, next) => {
    const id = req.cookies.userId;
    const type = req.cookies.userType;
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
    res.render('shop/SignInScreen', {
        userType: req.userType
    });
};

exports.postSignIn = (req, res, next) => {
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