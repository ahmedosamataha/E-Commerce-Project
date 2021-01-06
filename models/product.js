const Sequelize = require('sequelize');

const ProductTable = require('../database/tables/product');

const CartItem = require('./cart-item');

class Product {
    #product;

    constructor (product) {
        this.#product = product;
    }

    getProductData() {return this.#product;}

    getCartItem() {return CartItem.wrapUp(this.#product.cartItem);}

    getId() {return this.#product.id;}
    getName() {return this.#product.name;}
    getImageUrl() {return this.#product.imageUrl;}
    getPrice() {return this.#product.price;}
    getDescription() {return this.#product.description;}
    getQuantity() {return this.#product.quantity;}

    setName(name) {this.#product.title = name;}
    setImageUrl(imageUrl) {this.#product.imageUrl = imageUrl;}
    setPrice(price) {this.#product.price = price;}
    setDescription(description) {this.#product.description = description;}
    setQuantity(quantity) {this.#product.quantity = quantity;}

    destroy() {
        return this.#product.destroy();
    }

    save() {
        return this.#product.save();
    }

    static findAll(searchProp) {
        return ProductTable
                .findAll(searchProp)
                .then(products => {
                    return Product.wrapUp(products);
                });
    }

    static wrapUp(product) {
        if (Array.isArray(product))
            return product.map(prod => {
                if (prod)
                    return new Product(prod);
                return prod;
            });
        if (product)
            return new Product(product);
        return product;
    }

    static findById(id) {return Product.findByPk(id);}
    static findByPk(id) {
        console.log('in pk');
        return ProductTable
                .findByPk(id)
                .then(product => {
                    return Product.wrapUp(product);
                });
    }

    static getDB() { return ProductTable; }
}

module.exports = Product;
