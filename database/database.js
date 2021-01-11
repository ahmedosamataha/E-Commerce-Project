const sequelize = require('./init');

const consumer = require('./tables/consumer');
const product = require('./tables/product');
const cart = require('./tables/cart');
const cartItem = require('./tables/cart-item');
const order = require('./tables/order'); //v2 
const orderItem = require('./tables/order-item');//v2
const seller = require('./tables/seller');

consumer.hasOne(cart);
cart.belongsTo(consumer, {constraint: true, onDelete: 'CASCADE'}); // v3

consumer.hasMany(order); // v2
order.belongsTo(consumer, {constraint: true, onDelete: 'CASCADE'}); //v2 //v3

product.belongsToMany(cart, {through: cartItem});
cart.belongsToMany(product, {through: cartItem});

product.belongsToMany(order, {through: orderItem}); // v2
order.belongsToMany(product, {through: orderItem}); // v2

module.exports = sequelize;
