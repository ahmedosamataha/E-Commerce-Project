const Sequelize = require('sequelize');

const Order = require('./order'); //v2
const Cart = require('./cart');
const Offer = require('./offer');   //v8

const ConsumerTable = require('../database/tables/consumer');

class Consumer {
    #consumer;

    constructor (consumer) {
        this.#consumer = consumer;
    }

    getConsumerData() {return this.#consumer;}

    getId() { return this.#consumer.id; }
    getName() { return this.#consumer.name; }
    getPassword() { return this.#consumer.password; }
    getEmail() { return this.#consumer.email; }
    getGender() { return this.#consumer.gender; }
    getShippingAddress() { return this.#consumer.shippingAddress; } //v3
    getLastVisited() {return this.#consumer.lastVisited; } //v4

    setName(name) { this.#consumer.name = name; }
    setPassword(password) { this.#consumer.password = password; }
    setEmail(email) { this.#consumer.email = email; }
    setGender(gender) { this.#consumer.gender = gender; }
    setShippingAddress(shippingAddress) { this.#consumer.shippingAddress = shippingAddress; }   //v3
    setLastVisited(lastVisited) {this.#consumer.lastVisited = lastVisited; } //v4

    createCart() {
        return this.#consumer
                    .createCart()
                    .then(cart => {
                        return Cart.wrapUp(cart);
                    });
    }

    createOrder(prop) {  //v2
        return this.#consumer
                    .createOrder(prop)
                    .then(order => {
                        return Order.wrapUp(order);
                    });
    }

    destroy() {
        return this.#consumer.destroy();
    }

    save() {    // v2
            return this.#consumer.save();
        }

    getCart() {
        return this.#consumer
                    .getCart()
                    .then(cart => {
                        return Cart.wrapUp(cart);
                    });
    }
      
    getOffer() {    //v8
        return this.#consumer
                    .getOffer()
                    .then(offer => {
                        return Offer.wrapUp(offer);
                    });
    }

    getOrders(searchProp) { //v2
        return this.#consumer
                    .getOrders(searchProp)
                    .then(orders => {
                        return Order.wrapUp(orders);
                    })
                    // .catch(console.log('consumer.getOrders', err));
    }

    static getDB() {
        return ConsumerTable;
    }

    static wrapUp(consumer) {
        if (Array.isArray(consumer))
            return consumer.map(cons => {
                if (cons)
                    return new Consumer(cons);
                return cons;
            });
        if (consumer)
            return new Consumer(consumer);
        return consumer;
    }

    static create(consumer) {
        return ConsumerTable
                .create(consumer)
                .then(consumer => {
                    return Consumer.wrapUp(consumer);
                })
                .catch(err => console.log(err));
    }

    static findById(id) {return Consumer.findByPk(id);}
    static findByPk(id) {
        return ConsumerTable.findByPk(id)
            .then(consumer => {
                if (consumer) {
                    return Consumer.wrapUp(consumer);
                }
                return consumer;
            });
    }

    static findAll(searchProp) {
        return ConsumerTable
                .findAll(searchProp)
                .then(consumers => {
                    return Consumer.wrapUp(consumers);
                });
    }
}

module.exports = Consumer;
