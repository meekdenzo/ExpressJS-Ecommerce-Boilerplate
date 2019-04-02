const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const passport = require('passport');

const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const model = require(appRoot + '/app/database/models');

const Category = model.category;
const Product = model.product;

const { valCreateCategory, valUpdateCategory } = require('../../../validation/category');
const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const { validationResult } = require('express-validator/check');

/*
 @route POST api/v1/categories
 @desc  Create catagory
 @access PRIVATE
*/
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  valCreateCategory,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    const { name, description, department_id } = req.body;

    await Category.create({
      name,
      description,
      department_id
    });

    res.status(201).json({
      message: 'SUCCESS'
    });
  })
);
/*
 @route POST api/v1/categories
 @desc  Update catagory
 @access PRIVATE
*/
router.post(
  '/:id',
  valParam,
  passport.authenticate('jwt', {
    session: false
  }),
  valUpdateCategory,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    const { name, description } = req.body;

    await Category.update({ name, description }, { where: { category_id: req.params.id } });

    res.status(200).json({
      message: 'SUCCESS'
    });
  })
);
/*
 @route GET api/v1/categories/
 @desc  Get all catagories
 @access Public
*/
router.get(
  '/',
  valQuery,
  asyncMiddleware(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    const categories = await Category.findAll({
      attributes: ['category_id', 'description'],
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.status(200).json(categories);
  })
);
/*
 @route GET api/v1/categories/:id/products
 @desc  Get all products of catagories
 @access Public
*/
router.get(
  '/:id/products',
  [valParam, valQuery],
  asyncMiddleware(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    const category = await Category.findByPk(req.params.id, { attributes: ['category_id'] });

    if (!category) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    const products = await category.getProducts({
      attributes: ['description', 'name', 'price', 'discounted_price'],
      limit: req.query.limit,
      offset: req.query.offset
    });

    res.status(200).json(products);
  })
);
/*
 @route GET api/v1/categories/department/id
 @desc  Get all catagories by departmentId
 @access Public
*/
router.get(
  '/department/:id',
  [valParam, valQuery],
  asyncMiddleware(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    const category = await Category.findAll({
      where: {
        department_id: req.params.id
      },
      attributes: ['category_id', 'name'],
      limit: req.query.limit,
      offset: req.query.offset
    });

    if (!category) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    res.status(200).json(category);
  })
);
/*
 @route GET api/v1/categories/id
 @desc  Get all catagories by catagoryId
 @access Public
*/
router.get(
  '/:id',
  valQuery,
  asyncMiddleware(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    const category = await Category.findByPk(req.params.id, {
      attributes: ['name', 'description']
    });

    if (!category) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    res.status(200).json(category);
  })
);
/*
 @route DELETE api/v1/categories
 @desc  Create catagory
 @access PRIVATE
*/
router.delete(
  '/:id',
  valParam,
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    // if the category associate with any product it wont delete
    const count = await Category.count({
      where: { category_id: req.params.id },
      include: [{ model: Product, as: 'products' }]
    });

    if (count > 0) {
      return res.status(403).json({ message: 'FORBIDDEN' });
    }

    await Category.destroy({
      where: { category_id: req.params.id }
    });

    res.status(200).json({ message: 'SUCCESS' });
  })
);

module.exports = router;
