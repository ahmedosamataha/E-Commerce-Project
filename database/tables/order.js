const Sequelize = require('sequelize');

const sequelize = require('../init');

const OrderTable = sequelize.define('order', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = OrderTable;
