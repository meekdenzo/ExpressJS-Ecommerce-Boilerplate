const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan');
const appRoot = require('app-root-path');
const cors = require('cors');
const expressValidator = require('express-validator');

// Mount Validator Middleware
app.use(expressValidator());

// Cros Middleware
app.use(cors());

// Config Log Middleware
const winston = require(appRoot + '/app/utils/winston');
app.use(morgan('combined', { stream: winston.stream }));

// Passport Config
require(appRoot + '/app/utils/passport')(passport);

// Passport middleware
app.use(passport.initialize());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Load Routes
const category = require(appRoot + '/app/routes/api/v1/category');
const customer = require(appRoot + '/app/routes/api/v1/customer');
const department = require(appRoot + '/app/routes/api/v1/department');
const order = require(appRoot + '/app/routes/api/v1/order');
const product = require(appRoot + '/app/routes/api/v1/product');
const shoppingcart = require(appRoot + '/app/routes/api/v1/shoppingcart');
const user = require(appRoot + '/app/routes/api/v1/user');

// bodyParser Middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Use Routes
app.use('/api/v1/categories', category);
app.use('/api/v1/customers', customer);
app.use('/api/v1/departments', department);
app.use('/api/v1/orders', order);
app.use('/api/v1/products', product);
app.use('/api/v1/carts', shoppingcart);
app.use('/api/v1/users', user);

app.use('/api/static', express.static('upload'));

app.use(bodyParser.json());

const port = process.env.port || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
