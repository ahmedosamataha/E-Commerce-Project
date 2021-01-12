const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Product = require('../models/product');
const { should } = require('chai');

function areEqual(product, testProduct) {
    const name = product.getName();
    const quantity = +product.getQuantity();
    const tag = product.getTag();
    const description = product.getDescription();
    const imageUrl = product.getImageUrl();
    const price = +product.getPrice();
    // console.log('before name', name, testProduct.name);
    expect(name).to.be.equal(testProduct.name);
    expect(quantity).to.be.equal(testProduct.quantity);
    // console.log('name');
    expect(tag).to.be.equal(testProduct.tag);
    // console.log('name');
    expect(description).to.be.equal(testProduct.description);
    // console.log('name');
    expect(imageUrl).to.be.equal(testProduct.imageUrl);
    expect(price).to.be.equal(testProduct.price);
}

describe('Product', function () {
    const testProduct = {
        quantity: 10,
        tag: 'test',
        description: 'description',
        name: 'testProduct',
        imageUrl: 'urltest',
        price: 10.22
    }

    // before(function(done) {
    //     sequelize
    //         .sync()
    //         .then(() => {
    //             done();
    //         })
    //         .catch(err => console.log(err));
    // });

    it('should create a test product', function(done) {
        // console.log('creating a product', testProduct);
        Product.getDB().create(testProduct)
        .then(product => {
            // console.log('finished', product);
            const wrappedUpProduct = Product.wrapUp(product);
            testProduct.id = wrappedUpProduct.getId();
            areEqual(wrappedUpProduct, testProduct);
            done();
        })
    });

    it('should find the test product by findAll', function(done) {
        Product
            .findAll({where: {id: testProduct.id}})
            .then(products => {
                areEqual(products[0], testProduct);
                done();
            })
    })

    it('should find the test product by findById', function(done) {
        Product
            .findById(testProduct.id)
            .then(product => {
                areEqual(product, testProduct);
                done();
            })
    })

    it('should modify the test product', function(done) {
        testProduct.name = 'tester 2';
        testProduct.quantity = 454;
        testProduct.price = 4.5;
        testProduct.tag = '12321';
        testProduct.imageUrl = 'games';
        testProduct.description = '303 massra street';
        Product
            .findById(testProduct.id)
            .then(product => {
                product.setName(testProduct.name);
                product.setTag(testProduct.tag);
                product.setQuantity(testProduct.quantity);
                product.setPrice(testProduct.price);
                product.setDescription(testProduct.description);
                product.setImageUrl(testProduct.imageUrl);
                return product.save();
            })
            .then(product => {
                const wrappedUpProduct = Product.wrapUp(product);
                console.log(wrappedUpProduct.getImageUrl());
                areEqual(wrappedUpProduct, testProduct);
                done();
            })
    })

    // it('should create a cart', function(done) {
    //     Product
    //         .findById(testProduct.id)
    //         .then(product => product.createCart())
    //         .then(cart => {
    //             expect(cart).not.to.equal(null);
    //             done();
    //         })
    // })

    // it('should create an order', function(done) {
    //     Product
    //         .findById(testProduct.id)
    //         .then(product => product.createOrder())
    //         .then(order => {
    //             expect(order).not.to.equal(null);
    //             done();
    //         })
    // })

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
