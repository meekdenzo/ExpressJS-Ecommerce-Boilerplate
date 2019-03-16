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

Category

- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/categories
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/categories/1/products
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/categories/department/:id
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/categories/:id
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/categories
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/categories/:id
- (PROTECTED) DELETE https://tshirt-turing.herokuapp.com/api/v1/categories/:id

Customer

- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/customers/:id
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/customers
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/customers/shippping/region
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/customers/update
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/customers/address

Department

- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/departments
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/departments/:id
- (PUBLIC) POST https://tshirt-turing.herokuapp.com/api/v1/departments
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/departments/:id
- (PROTECTED) DELETE https://tshirt-turing.herokuapp.com/api/v1/departments/:id

Order

- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/orders/:id
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/orders/:id/details
- (PROTECTED) https://tshirt-turing.herokuapp.com/api/v1/orders/customer/:id
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/orders/:id
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/orders/:id/shippped

Product

- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/attribute
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/category
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/products/:id
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/location
- (PUBLIC) GET https://tshirt-turing.herokuapp.com/api/v1/products/:id/review
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/products/:id/attribute
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/products/:id/category
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/products/:id/review
- (PROTECTED) DELETE https://tshirt-turing.herokuapp.com/api/v1/products/:id

Shoppingcart

- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/carts/:cartId/saved
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/carts/:cartId/products
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/carts/:cartId/amount
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/carts
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/carts/create-payment
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/carts/execute-payment

User

- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/users/current
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/users/:id
- (PROTECTED) GET https://tshirt-turing.herokuapp.com/api/v1/users/facebook/callback
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/users/
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/users/signin
- (PROTECTED) POST https://tshirt-turing.herokuapp.com/api/v1/users/update

## Response Structure

- SUCCESS FETCH return data with header status 200 `{ data: }`
- SUCCESS UPDATE, CREATE or DELETE return json with with header status 422 `{message: 'SUCCESS'}`
- ERROR FETCH return json with header status 404 `{message: 'NOTFOUND' }`
- ERROR CREATE or UPDATE return json with header status 422 `{ "errors": [ { "location": "body", "param": "name", "msg": "Name is a required field." } ] }`
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

## Pagination

All GET Request support query

- limit
- offset

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
