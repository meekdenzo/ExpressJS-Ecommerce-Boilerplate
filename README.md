# E-commerce-Turing

T-shirt shopp is an e-commerce system which allows users to search, add items to their shopping cart, create order and checkout successfully.

- Admin can create product and assign category to it
- Admin can create product, category and product department
- Admin can review and manage customer orders
- Customer can fetch products , categories and department by id
- Customer can filiter and limit the result by adding limit and offset as query
- Customer can login and add product to there shopping cart
- Customer can save product for latter purchase
- Customer can give review to product
- Customer can login using there Social Network (FACEBOOK)
- Customer can check out using paypal or credit card
- Customer can update there information
- Customer can add multiple Address

# Best Practice!

- I use redis to catch customer shopping cart
- Users auth using JWT token based
- Use winston for Logging the app
- Hosted on heroku (https://tshirt-turing.herokuapp.com)

### Tech

This project uses a number of open source projects to work properly:

    bcryptjs
    body-parser
    concurrently
    cors
    express
    express-validator
    jsonwebtoken
    jwt-decode
    morgan
    mysql2
    nodemon
    passport
    passport-facebook
    passport-jwt
    redis
    request
    request-promise
    sequelize
    winston

### Installation

This proejct requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd e-commerce
$ npm install -d
$ npm run server
```
