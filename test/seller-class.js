const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Seller = require('../models/seller');
const Product = require('../models/product');//
const { should } = require('chai');

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

describe('Seller', function () {
    const testSeller = {
        email: 'test@test.com',
        password: 'test',
        name: 'tester'
    }

    const testProduct = {
        quantity: 11,
        tag: 'testshop',
        description: 'descriptionshop',
        name: 'testProductshop',
        imageUrl: 'urltestshop',
        price: 11.22
    }

    it('should create a test seller', function(done) {
        Seller.create(testSeller)
        .then(seller => {
            areEqual(seller, testSeller);
            testSeller.id = seller.getId();
            done();
        })
    });

    it('should find the test seller by findAll', function(done) {
        Seller
            .findAll({where: {email: testSeller.email}})
            .then(sellers => {
                areEqual(sellers[0], testSeller);
                done();
            })
    })

    it('should find the test seller by findById', function(done) {
        Seller
            .findById(testSeller.id)
            .then(seller => {
                areEqual(seller, testSeller);
                done();
            })
    })

    it('should modify the test seller', function(done) {
        testSeller.name = 'tester 2';
        testSeller.email = 'nice@testing.com';
        testSeller.password = '12321';
        testSeller.lastVisited = 'games';
        testSeller.shippingAddress = '303 massra street';
        Seller
            .findById(testSeller.id)
            .then(seller => {
                seller.setName(testSeller.name);
                seller.setPassword(testSeller.password);
                seller.setEmail(testSeller.email);
                return seller.save();
            })
            .then(seller => {
                const wrappedUpSeller = Seller.wrapUp(seller);
                areEqual(wrappedUpSeller, testSeller);
                done();
            })
    })

    it('should create a product', function(done) {
        Seller
            .findById(testSeller.id)
            .then(seller => {
                return seller.createProduct(testProduct)
            })
            .then(product => {
                testProduct.id = product.getId();
                areEqualProducts(product, testProduct);
                done();
            })
    })

    it('should get its products', function(done) {
        Seller
            .findById(testSeller.id)
            .then(seller => seller.getProducts())
            .then(products => {
                expect(products).to.have.property('length', 1);
                done();
            })
    })

    it('should delete the test seller', function(done) {
        Seller
            .findAll({where: {email: testSeller.email}})
            .then(sellers => {
                return sellers[0].destroy();
            })
            .then(() => {
                return Seller.findAll({where: {email: testSeller.email}});
            })
            .then(sellers => {
                expect(sellers).to.have.property('length', 0);
                done();
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
});
