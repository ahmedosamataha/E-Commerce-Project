const Sequelize = require('sequelize'); //v8

const sequelize = require('../init');

const OfferTable = sequelize.define('offer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = OfferTable;