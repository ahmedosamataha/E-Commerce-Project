const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { should } = require('chai');

// function areEqual(order, testOrder) {
//     const consumerId = order.getName();
//     expect(consumerId).to.be.equal(testOrder.consumerId);
// }

describe('Order', function () {
    let testOrder = {};

    it('should create a test order', function(done) {
        Order.getDB().create()
            .then(order => {
                testOrder.id = order.id;
                // console.log(order);
                expect(order).not.to.equal(null);
                done();
            })
    });

    it('should find the test order by findAll', function(done) {
        Order
            .findAll({where: {id: testOrder.id}})
            .then(orders => {
                expect(orders).to.have.property('length', 1);
                done();
            })
    })

    it('should find the test order by findById', function(done) {
        Order
            .findById(testOrder.id)
            .then(order => {
                expect(order).not.to.equal(null);
                done();
            })
    })

    it('should delete the test order', function(done) {
        Order
            .findById(testOrder.id)
            .then(order => {
                return order.destroy();
            })
            .then(() => {
                return Order.findAll({where: {id: testOrder.id}});
            })
            .then(orders => {
                expect(orders).to.have.property('length', 0);
                done();
            })
    })
});