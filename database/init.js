const Sequelize =  require('sequelize');

const sequelize = new Sequelize('sw-project', 'root', '0000', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;
