const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const Offer = require('../models/offer');
const Product = require('../models/product');

const { should } = require('chai');

function areEqualOffers(offer, testOffer) {
    const quantity = offer.getQuantity();
    expect(quantity).to.be.equal(testOffer.quantity);
}

describe('Offer', function () {
    let testOffer = {
        quantity: 10 //20%
    };

    it('should create a test offer', function(done) {
        Offer
            .getDB()
            .create(testOffer)
            .then(offer => {
                console.log('fsadf');
                testOffer.id = offer.id;
                let wrappedUpOffer = Offer.wrapUp(offer);
                areEqualOffers(wrappedUpOffer, testOffer);
                done();
            })
    });

    it('should find the test offer by findAll', function(done) {
        Offer
            .findAll({where: {id: testOffer.id}})
            .then(offers => {
                areEqualOffers(offers[0], testOffer);
                expect(offers).to.have.property('length', 1);
                done();
            })
    })

    it('should find the test offer by findById', function(done) {
        Offer
            .findById(testOffer.id)
            .then(offer => {
                areEqualOffers(offer, testOffer);
                done();
            })
    })

    it('should delete the test offer', function(done) {
        Offer
            .findById(testOffer.id)
            .then(offer => {
                return offer.destroy();
            })
            .then(() => {
                return Offer.findAll({where: {id: testOffer.id}});
            })
            .then(offers => {
                expect(offers).to.have.property('length', 0);
                done();
            })
    })
});