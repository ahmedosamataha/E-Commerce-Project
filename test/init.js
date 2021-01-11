const sequelize = require('../database/database');

before(function(done) {
    sequelize
        .sync()
        .then(() => {
            done();
        })
        .catch(err => console.log(err));
});

after(function(done) {
    sequelize
        .close()
        .then(() => {
            done();
        })
        .catch(err => console.log(err));
})
