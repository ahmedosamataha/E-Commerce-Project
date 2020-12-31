const Sequelize = require('sequelize');

const CartItemTable = require('../database/tables/cart-item');

class CartItem {
    #cartItem;

    constructor (cartItem) {
        this.#cartItem = cartItem;
    }

    getCartItemData() {return this.#cartItem;}

    getId() {return this.#cartItem.id;}
    getQuantity() {return this.#cartItem.quantity;}

    setQuantity(quantity) {this.#cartItem.quantity = quantity;}

    destroy() {
        return this.#cartItem.destroy();
    }

    save() {
        return this.#cartItem.save();
    }

    static wrapUp(cartItem) {
        if (Array.isArray(cartItem))
            return cartItem.map(c => {
                if (c)
                    return new Cart(c);
                return c;
            });
        if (cartItem)
            return new CartItem(cartItem);
        return cartItem;
    }

    static findById(id) {return CartItem.findByPk(id);}
    static findByPk(id) {
        return CartItemTable
                .findByPk(id)
                .then(cartItem => {
                    return this.wrapUp(cartItem);
                });
    }

    static findAll(searchProp) {
        return CartItemTable.findAll(searchProp);
    }

    static getDB() {
        return CartItemTable;
    }
}

module.exports = CartItem;