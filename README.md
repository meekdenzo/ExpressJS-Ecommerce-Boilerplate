# E-commerce

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
