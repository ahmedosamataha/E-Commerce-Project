const Sequelize = require('sequelize');

const OrderItemTable = require('../database/tables/order-item');

class OrderItem {
    #orderItem;

    constructor (orderItem) {
        this.#orderItem = orderItem;
    }

    getOrderItemData() {return this.#orderItem;}

    getId() {return this.#orderItem.id;}
    getQuantity() {return this.#orderItem.quantity;}
    getDiscount() {return this.#orderItem.discount;}

    setQuantity(quantity) {this.#orderItem.quantity = quantity;}
    setDiscount(discount) {this.#orderItem.discount = discount;}

    destroy() {
        return this.#orderItem.destroy();
    }

    save() {
        return this.#orderItem.save();
    }

    static wrapUp(orderItem) {
        if (Array.isArray(orderItem))
            return orderItem.map(c => {
                if (c)
                    return new OrderItem(c);
                return c;
            });
        if (orderItem)
            return new OrderItem(orderItem);
        return orderItem;
    }

    static findById(id) {return OrderItem.findByPk(id);}
    static findByPk(id) {
        return OrderItemTable
                .findByPk(id)
                .then(orderItem => {
                    return this.wrapUp(orderItem);
                });
    }

    static findAll(searchProp) {
        return OrderItemTable.findAll(searchProp);
    }

    static getDB() {
        return OrderItemTable;
    }
}

module.exports = OrderItem;
