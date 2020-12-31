const Sequelize = require('sequelize');

const CartTable = require('../database/tables/cart');

const Product = require('./product');

class Cart {
    #cart;

    constructor (cart) {
        this.#cart = cart;
    }

    getCartData() {return this.#cart;}

    getId() {return this.#cart.id;}
    getQuantity() {return this.#cart.quantity;}

    setQuantity(quantity) {this.#cart.quantity = quantity;}

    destroy() {
        return this.#cart.destroy();
    }

    save() {
        return this.#cart.save();
    }

    getProducts(searchProp) {
        return this.#cart
                    .getProducts(searchProp)
                    .then(products => {
                        return Product.wrapUp(products);
                    });
    }

    static wrapUp(cart) {
        if (Array.isArray(cart))
            return cart.map(c => {
                if (c)
                    return new Cart(c);
                return c;
            });
        if (cart)
            return new Cart(cart);
        return cart;
    }

    static findById(id) {return Cart.findByPk(id);}
    static findByPk(id) {
        return CartTable
                .findByPk(id)
                .then(cart => {
                    return Cart.wrapUp(cart);
                });
    }

    static findAll(searchProp) {
        return CartTable.findAll(searchProp);
    }

    static getDB() {
        return CartTable;
    }
}

module.exports = Cart;