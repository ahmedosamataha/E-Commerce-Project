const Sequelize =  require('sequelize');

const sequelize = new Sequelize('sw-project', 'postgres', '0000', {dialect: 'postgres', host: 'localhost'});



module.exports = sequelize;
