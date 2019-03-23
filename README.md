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

# Available REST API

Replace :id or :cartId placeholder with appropriate id

## Category

   
### GET https://tshirt-turing.herokuapp.com/api/v1/categories
   - Fetch all categories
   - Public API
   - Available query
        - limit
        - offset
   - Response
       - category_id
       - description
### GET https://tshirt-turing.herokuapp.com/api/v1/categories/1/products
   - Fetch all product by categories
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - description
       - name
       - price
       - discounted_price
       - product_category
            - category_id
            - product_id
### GET https://tshirt-turing.herokuapp.com/api/v1/categories/department/:id
   - Fetch all categories by department
   - Public
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - category_id
       - name
### GET https://tshirt-turing.herokuapp.com/api/v1/categories/:id
   - Fetch single category
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - description
       - name
### POST https://tshirt-turing.herokuapp.com/api/v1/categories
   - Create category
   - Private API
   - Body 
        - name
        - description
        - department_id
   - Response
       - "SUCCESS"
### POST https://tshirt-turing.herokuapp.com/api/v1/categories/:id
   - Update category
   - Private API
   - Param
        - id
   - Body 
        - name
        - description
   - Response
       - "SUCCESS"
### DELETE https://tshirt-turing.herokuapp.com/api/v1/categories/:id
   - Delete category
   - Private API
   - Param
        - id
   - Response
       - "SUCCESS"
## Customer
### GET https://tshirt-turing.herokuapp.com/api/v1/customers/:id
   - Fetch single customer
   - Private API
   - Param
        - id
   - Response
       - customer_id
       - first_name
       - last_name
       - credit_card
       - user_id
### GET https://tshirt-turing.herokuapp.com/api/v1/customers
   - Fetch all customers
   - Private API
   - Response Array
       - customer_id
       - first_name
       - last_name
       - credit_card
       - user_id
### GET https://tshirt-turing.herokuapp.com/api/v1/customers/shippping/region
   - Fetch customer shipping region
   - Private API
   - Response
       - shipping_region_id
       - shipping_region
### POST https://tshirt-turing.herokuapp.com/api/v1/customers/update
   - Update single customer
   - Private API
   - Body
       - first_name
       - last_name
       - credit_card
   - Response
        - "SUCCESS"
### POST https://tshirt-turing.herokuapp.com/api/v1/customers/address
   - Update single customer address
   - Private API
   - Body
       - eve_phone
       - day_phone
       - mob_phone
       - address_1
       - address_2
       - city
       - region
       - postal_code
       - shipping_region_id
   - Response
        - "SUCCESS"
## Department

### GET https://tshirt-turing.herokuapp.com/api/v1/departments
   - Fetch all departments
   - Public API
   - Response Array
       - department_id
       - name
       - description
### GET https://tshirt-turing.herokuapp.com/api/v1/departments/:id
   - Fetch single department
   - Public API
   - Param
       - id
   - Response
       - department_id
       - name
       - description
### POST https://tshirt-turing.herokuapp.com/api/v1/departments
   - Create department
   - Private API
   - body
       - name
       - description
### POST https://tshirt-turing.herokuapp.com/api/v1/departments/:id
   - Update department
   - Private API
   - Param
       - id
   - body
       - name
       - description
### DELETE https://tshirt-turing.herokuapp.com/api/v1/departments/:id
   - Delete department
   - Private API
   - Param
       - id
## Order
### GET https://tshirt-turing.herokuapp.com/api/v1/orders/:id
   - Fetch single order
   - Private API
   - Param
       - id
   - Response
       - order_id
       - total_amount
       - created_on
       - shipped_on
       - comments
       - status
       - customer_id
       - shipping_id
       - shipping_type
       - shipping_cost
       - tax_id
       - tax_type 
       - tax_percentage
### GET https://tshirt-turing.herokuapp.com/api/v1/orders/:id/details
   - Fetch single order details
   - Private API
   - Param
       - id
   - Response
       - attribute
       - product_name
       - quantity
       - unit_cost
       - order_id
       - product_id
### GET https://tshirt-turing.herokuapp.com/api/v1/orders/customer/:id
   - Fetch single order by customer
   - Private API
   - Param
       - id
   - Response
       - order_id
       - total_amount
       - created_on
       - status
       - customer_id
### POST https://tshirt-turing.herokuapp.com/api/v1/orders/:id
   - Update order
   - Private API
   - Param
       - id
   - body
       - status
       - comments
       - auth_code
       - reference
       - message
       - code
### POST https://tshirt-turing.herokuapp.com/api/v1/orders/:id/shipped
   - Create order shipped
   - Private API
   - Param
       - id
## Product

### GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/attribute
   - Fetch single product attributes
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - attribute_value_id
       - attribute_id
       - value
### GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/category
   - Fetch single product category
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - name
       - category_id
       - department_id
       - product_id
### GET https://tshirt-turing.herokuapp.com/api/v1/products/:id
   - Fetch single product
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - product_id
       - name
       - description
       - discounted_price
       - price
       - image
       - image_2
       - thumbnail
       - display
### GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/location
   - Fetch single product location
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - department_id
       - category_id
       - name
       - product_id
### GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/review
   - Fetch single product review
   - Public API
   - Param
        - id
   - Available query
        - limit
        - offset
   - Response
       - review
       - rating
       - created_on
       - first_name
       - product_id
### POST https://tshirt-turing.herokuapp.com/api/v1/products/:id/attribute
   - Create product attribute
   - Private API
   - Param
        - id
   - Body
       - attribute_value_id
   - Response
       - "SUCCESS"
### POST https://tshirt-turing.herokuapp.com/api/v1/products/:id/category
   - Create product category
   - Private API
   - Param
        - id
   - Body
       - category_id
   - Response
       - "SUCCESS"
### POST https://tshirt-turing.herokuapp.com/api/v1/products/:id/review
   - Create product category
   - Private API
   - Param
        - id
   - Body
       - review
       - rating
   - Response
       - "SUCCESS"
### DELETE https://tshirt-turing.herokuapp.com/api/v1/products/:id
   - Create product category
   - Private API
   - Param
        - id
   - Response
       - "SUCCESS"
## Shoppingcart

### GET https://tshirt-turing.herokuapp.com/api/v1/carts/:cartId/saved
   - Fetch saved product in cart
   - Private API
   - Param
        - id
   - Response
       - cart_id
       - item_id
       - attribute
       - quantity
       - products
            - name
            - price
            - discounted_price
### GET https://tshirt-turing.herokuapp.com/api/v1/carts/:cartId/products
   - Fetch all product in cart
   - Private API
   - Param
        - id
   - Response
       - cart_id
       - item_id
       - attribute
       - quantity
       - products
            - product_id
            - name
            - price
            - discounted_price
### GET https://tshirt-turing.herokuapp.com/api/v1/carts/:cartId/amount
   - Fetch the price of all product in cart
   - Private API
   - Param
        - id
   - Response
        - total
### POST https://tshirt-turing.herokuapp.com/api/v1/carts
   - Create cart
   - Private API
   - Body
       - cart_id
       - product_id
       - attribute
   - Response
       - "SUCCESS"
### POST https://tshirt-turing.herokuapp.com/api/v1/carts/create-payment
   - Create create payment for later execution
   - Private API
   - Body
       - tax_id
       - cart_id
       - shipping_id
   - Response
       - id
### POST https://tshirt-turing.herokuapp.com/api/v1/carts/execute-payment
   - Execute payment
   - Private API
   - Body
       - tax_id
       - cart_id
       - shipping_id
       - paymentID
       - payerID
   - Response
       - "SUCESS"
## User
### GET https://tshirt-turing.herokuapp.com/api/v1/users/current
   - Fetch current loggedin user
   - Private API
   - Response
       - user_id
       - email
       - password
       - facebook_access_token
       - role
### GET https://tshirt-turing.herokuapp.com/api/v1/users/:id
   - Fetch single user
   - Private API
   - Param
       - id
   - Response
       - user_id
       - email
       - password
       - facebook_access_token
       - role
### GET https://tshirt-turing.herokuapp.com/api/v1/users/facebook/callback
   - Callback facebook
   - Private API
### POST https://tshirt-turing.herokuapp.com/api/v1/users/
   - Create user
   - Public API
   - Body
       - first_name
       - last_name
       - email
       - password
       - password_confirmation
   - Response
       - "SUCCESS"
### POST https://tshirt-turing.herokuapp.com/api/v1/users/signin
   - Singin user
   - Public API
   - Body
       - email
       - password
   - Response
       - token
### POST https://tshirt-turing.herokuapp.com/api/v1/users/update
   - Update user
   - Private API
   - Body
       - email
       - password
       - password_confirmation
   - Response
       - "SUCCESS"
## Response Structure

- SUCCESS FETCH return data with header status 200 `{ data: }`
- SUCCESS UPDATE, CREATE or DELETE return json with with header status 422 `{message: 'SUCCESS'}`
- ERROR FETCH return json with header status 404 `{message: 'NOTFOUND' }`
- ERROR CREATE or UPDATE return json with header status 422 
    - Errors
        - location
        - param
        - msg
- ERROR unauthorized user return `Unauthorized` string

## Authentication

Request for reactJS

```
const signinUserRequest = async ({email, password}) =>
    await axios
    .post(`https://tshirt-turing.herokuapp.com/api/v1/users/signin/auth/signin`, { email, password })
    .then(response => response.data)
    .catch(error => error.response.data);

function* signinUser({ payload }) {
    const { history, user } = payload;
    try {
        const { token } = yield call(signinUserRequest, user);
        if (token) {
            const decodedToken = jwtDecode(token);
            setHeaderAuthToken(token);
            saveAuthToken(token);
            yield put(setAuthToken(token));
            yield put(authSuccess(decodedToken));
            yield put({type: CURRENT_USER})
            history.push("/");
        } else {
            yield put(authError(signinUser));
        }
    } catch (error) {
        console.log("signin failed :", error.message);
    }
}
```

Response from server

`{ "success": true, "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImNvZGVuaW5qYTB4MDFAZ21haWwuY29tIiwiaWF0IjoxNTUyNzU4NTc4LCJleHAiOjE1NTI3NjIxNzh9.tABe3TaV1TmnZ9ol3LDo18CcDwPLQsbOyDJ1A-Zk3WU" }`

## Access To Secure Routes
Set Header Authorization to token return from server
```
Authorization : Bearer {token}

```

## Pagination

All GET Request support query

- limit
- offset

## Redis Config
the config is in app/routes/api/v1/shoppingcart.js

````
if (process.env.REDISTOGO_URL) {
  const rtg = require('url').parse(process.env.REDISTOGO_URL);
  const redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(':')[1]);
  const gethAsync = promisify(redis.hgetall).bind(redis);
} else {
  const redis = require('redis').createClient();
  const gethAsync = promisify(redis.hgetall).bind(redis);
}
````
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
$ npm i
$ npm start
```
