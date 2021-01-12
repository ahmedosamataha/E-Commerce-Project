const Sequelize = require('sequelize'); //v8

const ReviewTable = require('../database/tables/review');

class Review {
    #review;

    constructor (review) {
        this.#review = review;
    }

    getReviewData() {return this.#review;}

    getId() {return this.#review.id;}
    getText() {return this.#review.text;}
    getRate() {return this.#review.rate;}
    getConsumerName() {return this.#review.consumerName;}

    setText(text) {this.#review.text = text;}
    setRate(rate) {this.#review.rate = rate;}
    setConsumerName(consumerName) {this.#review.consumerName = consumerName;}

    destroy() {
        return this.#review.destroy();
    }

    save() {
        return this.#review.save();
    }

    static wrapUp(review) {
        if (Array.isArray(review))
            return review.map(c => {
                if (c)
                    return new Review(c);
                return c;
            });
        if (review)
            return new Review(review);
        return review;
    }

    static findById(id) {return Review.findByPk(id);}
    static findByPk(id) {
        return ReviewTable
                .findByPk(id)
                .then(review => {
                    return this.wrapUp(review);
                });
    }

    static findAll(searchProp) {
        return ReviewTable.findAll(searchProp);
    }

    static getDB() {
        return ReviewTable;
    }
}

module.exports = Review;