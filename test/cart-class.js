const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { should } = require('chai');

// function areEqual(cart, testCart) {
//     const consumerId = cart.getName();
//     expect(consumerId).to.be.equal(testCart.consumerId);
// }

describe('Cart', function () {
    let testCart = {};

    it('should create a test cart', function(done) {
        // console.log('creating a cart', testCart);
        Cart.getDB().create()
            .then(cart => {
                testCart.id = cart.id;
                expect(cart).not.to.equal(null);
                done();
            })
    });

    it('should find the test cart by findAll', function(done) {
        Cart
            .findAll({where: {id: testCart.id}})
            .then(carts => {
                expect(carts).to.have.property('length', 1);
                done();
            })
    })

    it('should find the test cart by findById', function(done) {
        Cart
            .findById(testCart.id)
            .then(cart => {
                expect(cart).not.to.equal(null);
                done();
            })
    })

    it('should add a dummy product and get it', function(done) {
        let fetchedCart;
        Cart.findById(testCart.id)
            .then(cart => {
                fetchedCart = cart;
                return Product.findById(1);
            })
            .then(product => {
                // console.log(product.getName());
                return fetchedCart.addProduct(product, {through: {quantity: 1}});
            })
            .then(() => {
                return fetchedCart.getProducts();
            })
            .then(products => {
                expect(products).to.have.property('length', 1);
                done();
            })
    })

    it('should delete the test cart', function(done) {
        Cart
            .findById(testCart.id)
            .then(cart => {
                return cart.destroy();
            })
            .then(() => {
                return Cart.findAll({where: {id: testCart.id}});
            })
            .then(carts => {
                expect(carts).to.have.property('length', 0);
                done();
            })
    })

    // after(function(done) {
    //     sequelize
    //         .close()
    //         .then(() => {
    //             done();
    //         })
    //         .catch(err => console.log(err));
    // })
});