const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const shopControllers = require('../controllers/shop');
const authControllers = require('../controllers/auth');
const { should } = require('chai');
const Seller = require('../models/seller');
const Product = require('../models/product');

function areEqual(seller, testSeller) {
    const name = seller.getName();
    const email = seller.getEmail();
    const password = seller.getPassword();
    expect(name).to.be.equal(testSeller.name);
    expect(email).to.be.equal(testSeller.email);
    expect(password).to.be.equal(testSeller.password);
}

function areEqualProducts(product, testProduct) {
    const name = product.getName();
    const tag = product.getTag();
    const description = product.getDescription();
    const imageUrl = product.getImageUrl();
    const price = +product.getPrice();
    expect(name).to.be.equal(testProduct.name);
    expect(tag).to.be.equal(testProduct.tag);
    expect(description).to.be.equal(testProduct.description);
    expect(imageUrl).to.be.equal(testProduct.imageUrl);
    expect(price).to.be.equal(testProduct.price);
}

function printProduct(product) {
    console.log(product.getName());
    console.log(product.getQuantity());
    console.log(product.getTag());
    console.log(product.getImageUrl());
    console.log(product.getDescription());
}

describe('Seller user - controllers', function () {
    const testSeller = {
        email: 'test@test.comshopseller',
        password: 'testshopseller',
        name: 'testershopseller'
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
    
    it('should sign up testSeller', function(done) {
        req = {
            body: {
                type: 'seller', 
                ...testSeller, 
                repassword: testSeller.password
            }
        };
        const res = {
            redirect: (str) => {
                expect(str).to.equal('/sign-in');
                Seller
                    .findAll({where: {email: testSeller.email}})
                    .then(sellers => {
                        // console.log(sellers[0])
                        areEqual(sellers[0], testSeller);
                        testSeller.id = sellers[0].getId();
                        done();
                    })
            }
        }
        authControllers.postSignUpSeller(req, res, () => {})
    })

    it('should sign testSeller in', function(done) {
        req = {
            body: {
                email: testSeller.email,
                password: testSeller.password,
            }
        };
        const cookies = {};
        const res = {
            cookie: function(name, value) {
                cookies[name] = value;
            },
            redirect: () => {
                expect(cookies).to.have.property('userType', 'seller');
                expect(cookies).to.have.property('userId', testSeller.id);
                done();
            }
        }
        authControllers.postSignInSeller(req, res, () => {})
    })

    it('should find my account data an put it in the req object', function(done) {
        // console.log('req before', req)
        req = {
            cookies: {
                userId: testSeller.id,
                userType: 'seller'
            }
        }
        authControllers.findUser(req, {}, () => {
            areEqual(req.user, testSeller);
            done();
        })
    })

    it('should allow the seller to create a product', function(done) {
        req.body = {
            ...testProduct
        }

        const res = {
            redirect: function(path) {
                expect(path).to.equal('/');
                Product
                    .findAll({where: {name: testProduct.name}})
                    .then(products => {
                        areEqualProducts(products[0], testProduct);
                        testProduct.id = products[0].getId();
                        done();
                    })
            }
        }

        shopControllers.postCreateProduct(req, res, () => {});
    });

    it('should return the seller tester profile and the products they created', function(done) {
        let res = {
            render: function(path, data) {
                areEqual(data.user, testSeller);
                areEqualProducts(data.products[0], testProduct);
                expect(data.userType)
                done();
            }
        }
        shopControllers.getProfile(req, res, () => {});
    })
    
    it('should update the tester profile', function(done) {
        testSeller.email = "shoptest2seller@gmail.com";
        testSeller.password = "sellershoptest2passwrd";
        testSeller.name = "test2shopnameseller";
        req.body = {...testSeller};

        const res = {
            redirect: function() {
                Seller
                    .findById(testSeller.id)
                    .then(seller => {
                        areEqual(seller, testSeller);
                        done();
                    })
            }
        }
        shopControllers.postUpdateProfile(req, res, () => {});
    })

    it('should allow the seller to edit their products', function(done) {
        testProduct.quantity = 110;
        testProduct.tag = 'testshop22222';
        testProduct.description = 'descriptionshop222';
        testProduct.name = 'testProductshop222';
        testProduct.imageUrl = 'urltestshop222';
        testProduct.price = 1234.4;

        req.body = {
            ...testProduct
        }

        const res = {
            redirect: function(path) {
                expect(path).to.equal('/');
                Product
                    .findAll({where: {id: testProduct.id}})
                    .then(products => {
                        areEqualProducts(products[0], testProduct);
                        done();
                    })
            }
        }
        shopControllers.postCreateProduct(req, res, () => {});
    })

    it('should allow the seller to delete their products', function(done) {
        req.body = {
            productId: testProduct.id
        }

        const res = {
            redirect: function(path) {
                expect(path).to.equal('/seller-profile/' + testSeller.id);
                done();
            }
        }

        shopControllers.postDeleteProduct(req, res, () => {});
    })
     
    it('should sign out the test seller', function() {
        let cookiesToBeDeleted = [];
        let res = {
            clearCookie: (str) => {
                cookiesToBeDeleted.push(str);
            },
            redirect: function() {}
        }
        authControllers.signOut({}, res, () => {})
        expect(cookiesToBeDeleted).to.have.property('length', 2);
        expect(cookiesToBeDeleted[0]).to.equal('userId');
        expect(cookiesToBeDeleted[1]).to.equal('userType');
    })

    it('should delete the test seller', function(done) {
        Seller
            .findAll({where: {id: testSeller.id}})
            .then(sellers => {
                return sellers[0].destroy();
            })
            .then(() => {
                return Seller.findAll({where: {id: testSeller.id}});
            })
            .then(sellers => {
                expect(sellers).to.have.property('length', 0);
                done();
            })
    })
});