const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../config');
const { authAdministrator } = require('./controller');

const router = Router();


router.post(
  '/',
  [
    check('identityCard', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El rol es obligatorio').not().isEmpty(),
    validateFields
  ],
  authAdministrator
);



module.exports = router;