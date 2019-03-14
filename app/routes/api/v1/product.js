const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const passport = require('passport');

const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const model = require(appRoot + '/app/database/models');

const Product = model.product;
const Customer = model.customer;
const Department = model.department;
const Review = model.review;

const { valCreateProduct, valAttribute, valCategory, valReview } = require(appRoot +
  '/app/validation/product');
const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const { validationResult } = require('express-validator/check');

/*
 @access    Private
 @route     POST api/v1/products
 @desc      Create product
*/
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  valCreateProduct,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed

    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, price, description, category_id } = req.body;

    const product = await Product.create({ name, price, description });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    await product.setCategories(category_id);
    res.status(201).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     POST api/v1/products/:id/attribute
 @desc      Set product attribute value
*/
router.post(
  '/:id/attribute',
  passport.authenticate('jwt', {
    session: false
  }),
  valAttribute,
  valParam,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { attribute_value_id } = req.body;

    const product = await Product.findByPk(req.params.id, { attributes: ['product_id'] });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    await product.addAttributevalues(attribute_value_id);
    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     POST api/v1/products/:id/category
 @desc      Set product category
*/
router.post(
  '/:id/category',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  valCategory,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { category_id } = req.body;

    const product = await Product.findByPk(req.params.id, { attributes: ['product_id'] });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    await product.addCategories(category_id);
    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     POST api/v1/products/:id/review
 @desc      Set product review
*/
router.post(
  '/:id/review',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  valReview,
  asyncMiddleware(async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { review, rating } = req.body;
    const customer = await req.user.getCustomer();

    const product = await Product.findByPk(req.params.id, {
      attributes: ['product_id'],
      include: [{ model: Review, as: 'reviews' }]
    });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    const newReview = await Review.create({
      customer_id: customer.customer_id,
      review,
      rating,
      created_on: new Date()
    });

    await product.setReviews([newReview]);
    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     DELETE api/v1/products/:id
 @desc      Delete product
*/
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const product = await Product.findByPk(req.params.id, { attributes: ['product_id'] });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    await product.setCategories([]);
    await product.setAttributevalues([]);
    await product.destroy();
    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     GET api/v1/products/:id/attribute
 @desc      Get product attributes
*/
router.get(
  '/:id/attribute',
  valParam,
  valQuery,
  asyncMiddleware(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['product_id']
    });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    const attributes = await product.getAttributevalues({
      limit: req.query.limit,
      offset: req.query.offset
    });

    res.status(200).json(attributes);
  })
);
/*
 @access    Private
 @route     GET api/v1/products/:id/category
 @desc      Get categories for product
*/
router.get(
  '/:id/category',
  valParam,
  valQuery,
  asyncMiddleware(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['product_id']
    });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    const categories = await product.getCategories({
      attributes: ['name', 'category_id', 'department_id'],
      limit: req.query.limit,
      offset: req.query.offset
    });

    res.status(200).json(categories);
  })
);
/*
 @access    Private
 @route     GET api/v1/products/:id
 @desc      Get product info
*/
router.get(
  '/:id',
  valParam,
  asyncMiddleware(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'product_id',
        'name',
        'description',
        'discounted_price',
        'price',
        'image',
        'image_2',
        'thumbnail',
        'display'
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    res.status(200).json(product);
  })
);
/*
 @access    Private
 @route     GET api/v1/products/:id/location
 @desc      Get product location
*/
router.get(
  '/:id/location',
  valParam,
  valQuery,
  asyncMiddleware(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['product_id']
    });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    const location = await product.getCategories({
      include: [{ model: Department, attributes: ['name'] }],
      attributes: ['department_id', 'category_id', 'name'],
      limit: req.query.limit,
      offset: req.query.offset
    });

    res.status(200).json(location);
  })
);
/*
 @access    Private
 @route     GET api/v1/products/:id/review
 @desc      Get product review
*/
router.get(
  '/:id/review',
  valParam,
  valQuery,
  asyncMiddleware(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['product_id']
    });

    if (!product) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    const review = await product.getReviews({
      attributes: ['review', 'rating', 'created_on'],
      include: [{ model: Customer, attributes: ['name'] }],
      limit: req.query.limit,
      offset: req.query.offset
    });

    res.status(200).json(review);
  })
);

module.exports = router;
