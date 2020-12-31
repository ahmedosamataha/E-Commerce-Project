const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Setting ejs as the used templating engine to create dynamic website content
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));  // To automatically parse data
app.use(express.static(path.join(__dirname, 'views', 'logos')));  // Converting the logos folder to public, as to access it from the html pages

// Created this function just for testing
app.use('/', (req, res, next) => {
  res.send('<h1>Hello World! This is our testing html</h1>');
});

app.listen(3000);
