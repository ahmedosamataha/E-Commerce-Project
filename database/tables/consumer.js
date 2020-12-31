const Sequelize = require('sequelize');

const sequelize = require('../init');

const ConsumerTable = sequelize.define('consumer', {
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
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: Sequelize.STRING,
    gender: Sequelize.BOOLEAN
});

module.exports = ConsumerTable;