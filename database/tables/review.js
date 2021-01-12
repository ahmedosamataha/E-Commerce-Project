const Sequelize = require('sequelize'); //v8

const sequelize = require('../init');

const ReviewTable = sequelize.define('review', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    rate: {
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.STRING
    },
    consumerName: {
        type: Sequelize.STRING
    }
});

module.exports = ReviewTable;