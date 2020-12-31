const Sequelize = require('sequelize');

const sequelize = require('../init');

const CartItemTable = sequelize.define('cartItem', {
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

module.exports = CartItemTable;