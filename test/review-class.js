const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Review = require('../models/review');
const Product = require('../models/product');

const { should } = require('chai');

function areEqualReviews(review, testReview) {
    const id = review.getId();
    const text = review.getText();
    const rate = review.getRate();
    const consumerName = review.getConsumerName();
    expect(id).to.be.equal(testReview.id);
    expect(text).to.be.equal(testReview.text);
    expect(rate).to.be.equal(testReview.rate);
    expect(consumerName).to.be.equal(testReview.consumerName);
}

describe('Review', function () {
    let testReview = {
        text: 'testreviewtext',
        rate: 8,
        consumerName: 'testConsumerNamereview'
    };

    it('should create a test review', function(done) {
        Review
            .getDB()
            .create(testReview)
            .then(review => {
                testReview.id = review.id;
                let wrappedUpReview = Review.wrapUp(review);
                areEqualReviews(wrappedUpReview, testReview);
                done();
            })
    });

    it('should find the test review by findAll', function(done) {
        Review
            .findAll({where: {id: testReview.id}})
            .then(reviews => {
                areEqualReviews(reviews[0], testReview);
                expect(reviews).to.have.property('length', 1);
                done();
            })
    })

    it('should find the test review by findById', function(done) {
        Review
            .findById(testReview.id)
            .then(review => {
                areEqualReviews(review, testReview);
                done();
            })
    })

    it('should delete the test review', function(done) {
        Review
            .findById(testReview.id)
            .then(review => {
                return review.destroy();
            })
            .then(() => {
                return Review.findAll({where: {id: testReview.id}});
            })
            .then(reviews => {
                expect(reviews).to.have.property('length', 0);
                done();
            })
    })
});