const sequelize = require('./init');

const consumer = require('./tables/consumer');
const product = require('./tables/product');
const cart = require('./tables/cart');
const cartItem = require('./tables/cart-item');

consumer.hasOne(cart);
cart.belongsTo(consumer);

product.belongsToMany(cart, {through: cartItem});
cart.belongsToMany(product, {through: cartItem});

module.exports = sequelize;