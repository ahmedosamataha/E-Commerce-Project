const Sequelize = require('sequelize');

const sequelize = require('../init');

const CartTable = sequelize.define('cart', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = CartTable;
