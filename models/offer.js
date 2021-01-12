const Sequelize = require('sequelize'); //v8

const OfferTable = require('../database/tables/offer');

class Offer {
    #offer;

    constructor (offer) {
        this.#offer = offer;
    }

    getOfferData() {return this.#offer;}

    getId() {return this.#offer.id;}
    getQuantity() {return this.#offer.quantity;}

    setQuantity(quantity) {this.#offer.quantity = quantity;}

    destroy() {
        return this.#offer.destroy();
    }

    save() {
        return this.#offer.save();
    }

    static wrapUp(offer) {
        if (Array.isArray(offer))
            return offer.map(c => {
                if (c)
                    return new Offer(c);    
                return c;
            });
        if (offer)
            return new Offer(offer);
        return offer;
    }

    static findById(id) {return Offer.findByPk(id);}
    static findByPk(id) {
        return OfferTable
                .findByPk(id)
                .then(offer => {
                    return this.wrapUp(offer);
                });
    }

    static findAll(searchProp) {
        return OfferTable.findAll(searchProp);
    }

    static getDB() {
        return OfferTable;
    }
}

module.exports = Offer;