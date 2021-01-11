const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Consumer = require('../models/consumer');
const { should } = require('chai');

function areEqual(consumer, testConsumer) {
    const name = consumer.getName();
    const email = consumer.getEmail();
    const password = consumer.getPassword();
    const shippingAddress = consumer.getShippingAddress();
    const lastVisited = consumer.getLastVisited();
    expect(name).to.be.equal(testConsumer.name);
    expect(email).to.be.equal(testConsumer.email);
    expect(password).to.be.equal(testConsumer.password);
    expect(shippingAddress).to.be.equal(testConsumer.shippingAddress);
}

describe('Consumer', function () {
    const testConsumer = {
        email: 'test@test.com',
        password: 'test',
        shippingAddress: 'shippingAddress',
        name: 'tester',
        lastVisited: 'books'
    }

    // before(function(done) {
    //     sequelize
    //         .sync()
    //         .then(() => {
    //             done();
    //         })
    //         .catch(err => console.log(err));
    // });

    it('should create a test consumer', function(done) {
        Consumer.create(testConsumer)
        .then(consumer => {
            areEqual(consumer, testConsumer);
            testConsumer.id = consumer.getId();
            done();
        })
    });

    it('should find the test consumer by findAll', function(done) {
        Consumer
            .findAll({where: {email: testConsumer.email}})
            .then(consumers => {
                areEqual(consumers[0], testConsumer);
                done();
            })
    })

    it('should find the test consumer by findById', function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => {
                areEqual(consumer, testConsumer);
                done();
            })
    })

    it('should modify the test consumer', function(done) {
        testConsumer.name = 'tester 2';
        testConsumer.email = 'nice@testing.com';
        testConsumer.password = '12321';
        testConsumer.lastVisited = 'games';
        testConsumer.shippingAddress = '303 massra street';
        Consumer
            .findById(testConsumer.id)
            .then(consumer => {
                consumer.setName(testConsumer.name);
                consumer.setPassword(testConsumer.password);
                consumer.setEmail(testConsumer.email);
                consumer.setShippingAddress(testConsumer.shippingAddress);
                consumer.setLastVisited(testConsumer.lastVisited);
                return consumer.save();
            })
            .then(consumer => {
                const wrappedUpConsumer = Consumer.wrapUp(consumer);
                areEqual(wrappedUpConsumer, testConsumer);
                done();
            })
    })

    it('should create a cart', function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => consumer.createCart())
            .then(cart => {
                expect(cart).not.to.equal(null);
                done();
            })
    })

    it('should create an order', function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => consumer.createOrder())
            .then(order => {
                expect(order).not.to.equal(null);
                done();
            })
    })

    it('should get its cart', function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => consumer.getCart())
            .then(cart => {
                expect(cart).not.to.equal(null);
                done();
            })
    })

    it('should get its orders', function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => consumer.getOrders())
            .then(orders => {
                expect(orders).to.have.property('length', 1);
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

    // after(function(done) {
    //     sequelize
    //         .close()
    //         .then(() => {
    //             done();
    //         })
    //         .catch(err => console.log(err));
    // })
});