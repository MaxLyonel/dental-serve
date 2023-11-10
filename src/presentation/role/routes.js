const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validarJWT } = require('../../config');
const { getRoles, createRole } = require('./controller');

const router = Router();

// router.use(validarJWT);

router.get('/', getRoles)

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'El apellido es obligatorio').not().isEmpty(),
    check('permissionIds', 'permissionIds debe ser un array').isArray(),
    validateFields
  ],
  createRole
);


module.exports = router;