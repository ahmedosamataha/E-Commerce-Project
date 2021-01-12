const Sequelize = require('sequelize');

const Product = require('./product'); //v7
const SellerTable = require('../database/tables/seller');

class Seller {
    #seller;

    constructor (seller) {
        this.#seller = seller;
    }

    getSellerData() {return this.#seller;}

    getId() { return this.#seller.id; }
    getName() { return this.#seller.name; }
    getPassword() { return this.#seller.password; }
    getEmail() { return this.#seller.email; }
    
    setName(name) { this.#seller.name = name; }
    setPassword(password) { this.#seller.password = password; }
    setEmail(email) { this.#seller.email = email; }

    createProduct(product) {
        return this.#seller
                    .createProduct(product)
                    .then(product => {
                        return Product.wrapUp(product);
                    });
    }

    destroy() {
        return this.#seller.destroy();
    }

    save() {    // v2
        return this.#seller.save();
    }

    getProducts(searchProp) {
        return this.#seller
                    .getProducts(searchProp)
                    .then(products => {
                        return Product.wrapUp(products);
                    });
    }

    static getDB() {
        return SellerTable;
    }

    static wrapUp(seller) {
        if (Array.isArray(seller))
            return seller.map(sell => {
                if (sell)
                    return new Seller(sell);
                return sell;
            });
        if (seller)
            return new Seller(seller);
        return seller;
    }

    static create(seller) {
        return SellerTable
                .create(seller)
                .then(seller => {
                    return Seller.wrapUp(seller);
                })
                .catch(err => console.log(err));
    }

    static findById(id) {return Seller.findByPk(id);}
    static findByPk(id) {
        return SellerTable.findByPk(id)
            .then(seller => {
                if (seller) {
                    return Seller.wrapUp(seller);
                } 
                return seller;
            });
    }

    static findAll(searchProp) {
        return SellerTable
                .findAll(searchProp)
                .then(sellers => {
                    return Seller.wrapUp(sellers);
                });
    }
}

module.exports = Seller;