const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const shopControllers = require('../controllers/shop');
const authControllers = require('../controllers/auth');
const { should } = require('chai');
const Consumer = require('../models/consumer');
const Product = require('../models/product');

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

function areEqualProducts(product, testProduct) {
    const name = product.getName();
    const quantity = +product.getQuantity();
    const tag = product.getTag();
    const description = product.getDescription();
    const imageUrl = product.getImageUrl();
    const price = +product.getPrice();
    expect(name).to.be.equal(testProduct.name);
    expect(quantity).to.be.equal(testProduct.quantity);
    expect(tag).to.be.equal(testProduct.tag);
    expect(description).to.be.equal(testProduct.description);
    expect(imageUrl).to.be.equal(testProduct.imageUrl);
    expect(price).to.be.equal(testProduct.price);
}

describe('Shop - controller', function () {
    const testConsumer = {
        email: 'test@test.comshop',
        password: 'testshop',
        shippingAddress: 'shippingAddressshop',
        name: 'testershop'
    }

    const testProduct = {
        quantity: 11,
        tag: 'testshop',
        description: 'descriptionshop',
        name: 'testProductshop',
        imageUrl: 'urltestshop',
        price: 11.22
    }
    
    let req;
    
    before(function (done) {
        Consumer
            .create(testConsumer)
            .then(consumer => {
                testConsumer.id = consumer.getId();
                req = {
                    cookies: {
                        userId: testConsumer.id,
                        userType: 'consumer'
                    }
                }
                done();
            })
    })

    it('should create a cart for the tester', function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => consumer.createCart())
            .then(cart => {
                expect(cart).not.to.equal(null);
                done();
            })
    })

    it('should create a test product for the test', function(done) {
        // console.log('creating a product', testProduct);
        Product.getDB().create(testProduct)
        .then(product => {
            const wrappedUpProduct = Product.wrapUp(product);
            testProduct.id = wrappedUpProduct.getId();
            areEqualProducts(wrappedUpProduct, testProduct);
            done();
        })
    });

    it('should find my account', function(done) {
        // console.log('req before', req)
        authControllers.findUser(req, {}, () => {
            areEqual(req.user, testConsumer);
            done();
        })
    })

    it('should return the tester profile', function(done) {
        let res = {
            render: function(path, data) {
                areEqual(data.user, testConsumer);
                expect(data.userType)
                done();
            }
        }
        shopControllers.getProfile(req, res, () => {});
    })
    
    it('should update the tester profile', function(done) {
        testConsumer.email = "shoptest2@gmail.com";
        testConsumer.password = "shoptest2passwrd";
        testConsumer.name = "test2shopname";
        req.body = {...testConsumer};

        const res = {
            redirect: function() {
                Consumer
                    .findById(testConsumer.id)
                    .then(consumer => {
                        areEqual(consumer, testConsumer);
                        done();
                    })
            }
        }

        shopControllers.postUpdateProfile(req, res, () => {});
    })

    it('should find my recommendations', function(done) {
        const res = {
            render: function(path, data) {
                areEqualProducts(data.products[0], testProduct);
                done();
            }
        }

        let fetchedConsumer;
        Consumer
            .findById(testConsumer.id)
            .then(consumer => {
                fetchedConsumer = consumer;
                consumer.setLastVisited(testProduct.tag);
                return consumer.save();
            })
            .then(() => {
                req.user = fetchedConsumer;
                shopControllers.getRecommendations(req, res, () => {});
            })
    })
     

    it('should delete the test product', function(done) {
        Product
            .findById(testProduct.id)
            .then(product => {
                return product.destroy();
            })
            .then(() => {
                return Product.findAll({where: {id: testProduct.id}});
            })
            .then(products => {
                expect(products).to.have.property('length', 0);
                done();
            })
    })

    it('should delete the test consumer', function(done) {
        Consumer
            .findAll({where: {email: testConsumer.email}})
            .then(consumers => {
                return consumers[0].destroy();
            })
            .then(() => {
                return Consumer.findAll({where: {email: testConsumer.email}});
            })
            .then(consumers => {
                expect(consumers).to.have.property('length', 0);
                done();
            })
    })
});