const Sequelize = require('sequelize');

const OrderTable = require('../database/tables/order');

const Product = require('./product');

class Order {
    #order;

    constructor (order) {
        this.#order = order;
    }

    getOrderData() {return this.#order;}

    getId() {return this.#order.id;}
    getQuantity() {return this.#order.quantity;}

    setQuantity(quantity) {this.#order.quantity = quantity;}

    destroy() {
        return this.#order.destroy();
    }

    save() {
        return this.#order.save();
    }

    addProducts(products, prop) {
        return this.#order
                    .addProducts(products.map(product => {
                        let p = product.getProductData();
                        p.orderItem = { quantity: product.getCartItem().getQuantity() };
                        return p;
                    }), prop)
                    // .catch(err => console.log('addProduct', err));
    }

    getProducts(searchProp) {
        if (this.#order.products)
            return Product.wrapUp(this.#order.products);
        return this.#order
                    .getProducts(searchProp)
                    .then(products => {
                        return Product.wrapUp(products);
                    });
    }

    static wrapUp(order) {
        if (Array.isArray(order))
            return order.map(c => {
                if (c)
                    return new Order(c);
                return c;
            });
        if (order)
            return new Order(order);
        return order;
    }

    static findById(id) {return Order.findByPk(id);}
    static findByPk(id) {
        return OrderTable
                .findByPk(id)
                .then(order => {
                    return Order.wrapUp(order);
                });
    }

    static findAll(searchProp) {
        return OrderTable.findAll(searchProp);
    }

    static getDB() {
        return OrderTable;
    }
}

module.exports = Order;