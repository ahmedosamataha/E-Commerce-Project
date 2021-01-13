const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const authControllers = require('../controllers/auth');
const shopControllers = require('../controllers/shop');
const { should } = require('chai');
const Consumer = require('../models/consumer');
const Seller = require('../models/seller');
const Product = require('../models/product');
const Review = require('../models/review');
const Offer = require('../models/offer');

function areEqual(consumer, testConsumer) {
    const name = consumer.getName();
    const email = consumer.getEmail();
    const password = consumer.getPassword();
    const shippingAddress = consumer.getShippingAddress();
    expect(name).to.be.equal(testConsumer.name);
    expect(email).to.be.equal(testConsumer.email);
    expect(password).to.be.equal(testConsumer.password);
    expect(shippingAddress).to.be.equal(testConsumer.shippingAddress);
}

describe('Admin user', function () {
    const testConsumer = {
        email: 'test@test.comauthADMIN',
        password: 'testauth',
        shippingAddress: 'shippingAddressauthDELETETHIS',
        name: 'testerauth'
    }

    const testSeller = {
        email: 'test@test.comshopsellerADMIN',
        password: 'testshopseller',
        name: 'testershopseller'
    }

    const testProduct = {
        quantity: 10,
        tag: 'testADMIN',
        description: 'description',
        name: 'testProduct',
        imageUrl: 'urltest',
        price: 10.22
    }

    let req;

    //v9
    it('should sign admin in', function(done) {
        req = {
            body: {
                email: "admin@admin.com",
                password: "admin"
            }
        };
        const cookies = {};
        const res = {
            cookie: function(name, value) {
                cookies[name] = value;
            },
            redirect: () => {
                expect(cookies).to.have.property('userType', 'admin');
                expect(cookies).to.have.property('userId', 1);
                done();
            }
        }
        authControllers.postSignInAdmin(req, res, () => {})
    })

    it('should create a test consumer', function(done) {
        Consumer.create(testConsumer)
        .then(consumer => {
            expect(consumer).not.to.equal(null);
            testConsumer.id = consumer.getId();
            done();
        })
    });

    it('should create a test seller', function(done) {
        Seller.create(testSeller)
        .then(seller => {
            expect(seller).not.to.equal(null);
            testSeller.id = seller.getId();
            done();
        })
    });

    it('should create a test product', function(done) {
        Product.getDB().create(testProduct)
        .then(product => {
            testProduct.id = product.id;
            expect(product).not.to.equal(null);
            done();
        })
    });

    it('should find the user for given cookies', function(done) {
        req = {
            cookies: {
                userId: 1,
                userType: 'admin'
            }
        }
        authControllers.findUser(req, {}, () => {
            expect(req.userType).to.equal('admin');
            done();
        })
    })

    it('should allow the admin to add offers', function(done) { //v10
        req.body = {
            userId: testConsumer.id,
            quantity: 10
        }

        const res = {
            redirect: function(path) {
                Consumer.findById(testConsumer.id)
                    .then(consumer => consumer.getOffer())
                    .then(offer => {
                        expect(offer).not.to.be.null;
                        done();
                    })
            }
        }

        shopControllers.postOfferConsumer(req, res, () => {});
    })

    it('should allow the admin to delete the test product', function(done) {
        req.body = {
            productId: testProduct.id
        }

        const res = {
            redirect: function(path) {
                Product.findAll({where: {id: testProduct.id}})
                    .then(prod => {
                        expect(prod.length).to.equal(0);
                        expect(path).to.equal('/');
                        done();
                    })
            }
        }

        shopControllers.postDeleteProduct(req, res, () => {});
    })

    it('should allow the admin to delete the test seller', function(done) {
        req.body = {
            userType: 'seller',
            userId: testSeller.id
        }

        const res = {
            redirect: function(path) {
                Seller.findAll({where: {id: testSeller.id}})
                    .then(sellers => {
                        expect(sellers.length).to.equal(0);
                        done();
                    })
            }
        }

        shopControllers.postDeleteUser(req, res, () => {});
    })

    it('should allow the admin to delete the test consumer', function(done) {
        req.body = {
            userType: 'consumer',
            userId: testConsumer.id
        }

        const res = {
            redirect: function(path) {
                Consumer.findAll({where: {id: testSeller.id}})
                    .then(consumers => {
                        expect(consumers.length).to.equal(0);
                        done();
                    })
            }
        }

        shopControllers.postDeleteUser(req, res, () => {});
    })

    it('should allow the admin to sign out', function() {
        let cookiesToBeDeleted = [];
        let res = {
            clearCookie: (str) => {
                cookiesToBeDeleted.push(str);
            },
            redirect: function() {}
        }
        authControllers.signOut({}, res, () => {})
        // console.log(cookiesToBeDeleted);
        expect(cookiesToBeDeleted).to.have.property('length', 2);
        expect(cookiesToBeDeleted[0]).to.equal('userId');
        expect(cookiesToBeDeleted[1]).to.equal('userType');
        // done();
    })
});
