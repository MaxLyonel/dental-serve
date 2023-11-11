const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../config');
const { validateJWT } = require('./../middlewares');
const { getPatients, createPatient, updatePatient, deletePatient } = require('./controller');

const router = Router();

router.use(validateJWT);

router.get('/', getPatients)

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
    // paciente
    check('allergies', 'El rol es obligatorio').not().isEmpty(),
    check('bloodType', 'El rol es obligatorio').not().isEmpty(),
    validateFields
  ],
  createPatient
);

router.put(
  '/:patientId',
  [
    // user
    check('identityCard', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('phone', 'El email es obligatorio').isMobilePhone(),
    check('birthDate', 'El rol es obligatorio').not().isDate(),
    check('gender', 'El rol es obligatorio').not().isEmpty(),
    // paciente
    check('allergies', 'El rol es obligatorio').not().isEmpty(),
    check('bloodType', 'El rol es obligatorio').not().isEmpty(),
    validateFields
  ],
  updatePatient
);

router.delete(
  '/:patientId',
  deletePatient
);


module.exports = router;