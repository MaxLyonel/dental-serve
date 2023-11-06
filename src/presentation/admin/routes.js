const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validarJWT } = require('../../config');
const { getAdministrators, createAdministrator, updateUser, deleteUser } = require('./controller');
// const { emailExists } = require('./../../helpers');

const router = Router();

// router.use(validarJWT);

router.get('/', getAdministrators)

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('phone', 'El email es obligatorio').isMobilePhone(),
    check('birthDate', 'El rol es obligatorio').not().isDate(),
    check('gender', 'El rol es obligatorio').not().isEmpty(),
    validateFields
  ],
  createAdministrator
);
// router.put(
//   '/:id',
//   [
//     check('name', 'El nombre es obligatorio').not().isEmpty(),
//     check('lastName', 'El apellido es obligatorio').not().isEmpty(),
//     check('email', 'El email es obligatorio').isEmail(),
//     check("email").custom(emailExists),
//     check('typeUserId', 'El tipo de usuario es obligatorio').not().isEmpty(),
//     check('roleId', 'El rol es obligatorio').not().isEmpty(),
//     validarCampos
//   ],
//   updateUser
// );
// router.delete(
//   '/:id',
//   deleteUser
// );


module.exports = router;