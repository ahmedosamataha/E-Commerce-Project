const Sequelize = require('sequelize');

const sequelize = require('../init');

const SellerTable = sequelize.define('seller', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    shippingAddress: {  // v3
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: Sequelize.BOOLEAN,
    lastVisited: Sequelize.STRING //v4
});

module.exports = SellerTable;
