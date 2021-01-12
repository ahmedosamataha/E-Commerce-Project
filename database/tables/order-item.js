const Sequelize = require('sequelize');

const sequelize = require('../init');

const OrderItemTable = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    discount: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = OrderItemTable;
