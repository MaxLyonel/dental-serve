const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../config');
const { validateJWT } = require('./../middlewares');
const { getAdministrators, createAdministrator, updateAdministrator, deleteAdministrator } = require('./controller');

const router = Router();

router.use(validateJWT);

router.get('/', getAdministrators)

router.post(
  '/',
  [
    // user
    check('identityCard', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('phone', 'El email es obligatorio').isMobilePhone(),
    check('birthDate', 'El rol es obligatorio').not().isDate(),
    check('gender', 'El rol es obligatorio').not().isEmpty(),
    // administrator
    check('roleId', 'El rol es obligatorio').not().isEmpty(),
    validateFields
  ],
  createAdministrator
);

router.put(
  '/:administratorId',
  [
    // user
    check('identityCard', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('phone', 'El email es obligatorio').isMobilePhone(),
    check('birthDate', 'El rol es obligatorio').not().isDate(),
    check('gender', 'El rol es obligatorio').not().isEmpty(),
    // administrator
    check('roleId', 'El rol es obligatorio').not().isEmpty(),
    validateFields
  ],
  updateAdministrator
);

router.delete(
  '/:administratorId',
  deleteAdministrator
);


module.exports = router;