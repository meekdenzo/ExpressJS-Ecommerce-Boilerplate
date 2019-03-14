const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const passport = require('passport');

const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const model = require(appRoot + '/app/database/models');
const Department = model.department;

const { valCreateDepartment, valUpdateDepartment } = require(appRoot +
  '/app/validation/department');
const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const { validationResult } = require('express-validator/check');

/*
 @route     POST api/v1/departments
 @desc      Create department
 @access    Private
*/
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  valCreateDepartment,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    await Department.create({ name, description });
    res.status(201).json({ message: 'SUCCESS' });
  })
);

/*
 @route     POST api/v1/departments/:id
 @desc      Update department by Id
 @access    Private
*/
router.post(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  valUpdateDepartment,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    errors = [];
    const { name, description } = req.body;

    const department = await Department.findByPk(req.params.id, { attributes: ['department_id'] });

    if (!department) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }

    await department.update({ name, description });
    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @route GET api/v1/departments/:id
 @desc  Get department detail by Id
 @access Public
*/
router.get(
  '/:id',
  valParam,
  valQuery,
  asyncMiddleware(async (req, res) => {
    const department = await Department.findByPk(req.params.id, {
      attributes: ['name', 'description'],
      limit: req.query.limit,
      offset: req.query.offset
    });
    if (!department) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }
    res.status(200).json(department);
  })
);
/*
 @route GET api/v1/departments
 @desc  Get all department
 @access Public
*/
router.get(
  '/',
  valQuery,
  asyncMiddleware(async (req, res) => {
    const department = await Department.findAll({
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.status(200).json(department);
  })
);
/*
 @route DELETE api/v1/departments/:id
 @desc  Delete dapartment by Id
 @access Private
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

    const affectedRows = await Department.destroy({ where: { department_id: req.params.id } });
    if (!affectedRows) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }
    res.status(200).json({ message: 'SUCCESS' });
  })
);

module.exports = router;
