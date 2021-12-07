const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const sequelize = require('./database/database');

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');

const app = express();

// Setting ejs as the used templating engine to create dynamic website content
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));  // To automatically parse data
app.use(express.static(path.join(__dirname, 'views', 'logos')));  // Converting the logos folder to public, as to access it from the html pages

app.use(authRoutes);
app.use(shopRoutes);



app.use((req, res, next) => {
    res.render('error/Error', {
        userType: req.userType,
        user: req.user,
        isAllowed: req.isAllowed //v3
    });
});

sequelize
    .sync()
    //.sync({force: true})
    .then(() => {
        app.listen(3000);
        console.log('Server started');
    })
    .catch(err => console.log(err));

// Created this function just for testing
/*app.use('/', (req, res, next) => {
  res.send('<h1>Hello World! This is our testing html</h1>');
});

app.listen(3000);*/
