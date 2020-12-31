const Sequelize = require('sequelize');

const Cart = require('./cart');
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

    setName(name) { this.#consumer.name = name; }
    setPassword(password) { this.#consumer.password = password; }
    setEmail(email) { this.#consumer.email = email; }
    setGender(gender) { this.#consumer.gender = gender; }

    createCart() {
        return this.#consumer
                    .createCart()
                    .then(cart => {
                        return Cart.wrapUp(cart);
                    });
    }

    destroy() {
        return this.#consumer.destroy();
    }

    getCart() {
        return this.#consumer
                    .getCart()
                    .then(cart => {
                        return Cart.wrapUp(cart);
                    });
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
        if (cons)
            return new Consumer(cons);
        return cons;
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
        return UserTable.findByPk(id)
            .then(consumer => {
                if (consumer) {
                    return Consumer.wrapUp(consumer);
                } 
                return consumer;
            });
    }

    static findAll(searchProp) {
        return ConsumerTable.findAll(searchProp);
    }
}

module.exports = Consumer;