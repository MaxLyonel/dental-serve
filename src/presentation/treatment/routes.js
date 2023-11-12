const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('./../../config');
const { validateJWT } = require('./../middlewares');
const { getTreatments, createTreatment, updateTreatment, deleteTreatment } = require('./controller');

const router = Router();

router.use(validateJWT);

router.get('/', getTreatments)

router.post(
  '/',
  [
    //treatment
    check('stageTypeId', 'Es necesario el id de la etapa').not().isEmpty(),
    check('patientId', 'Es necesario el id del paciente').not().isEmpty(),
    check('description', 'Es necesario la descripción').not().isEmpty(),
    check('date', 'Es necesario la fecha del tratamiento').not().isEmpty(),
    check('totalAmount', 'Es necesario el monto total del tratamiento').isDecimal(),
    //theth
    check('thethIds', 'thethIds debe ser un array').isArray(),
    validateFields
  ],
  createTreatment
);

router.put(
  '/:treatmentId',
  [
    //treatment
    check('stageTypeId', 'Es necesario el id de la etapa').not().isEmpty(),
    check('patientId', 'Es necesario el id del paciente').not().isEmpty(),
    check('description', 'Es necesario la descripción').not().isEmpty(),
    check('date', 'Es necesario la fecha del tratamiento').not().isEmpty(),
    check('totalAmount', 'Es necesario el monto total del tratamiento').isDecimal(),
    //theth
    check('thethIds', 'thethIds debe ser un array').isArray(),
    validateFields
  ],
  updateTreatment
);

router.delete(
  '/:treatmentId',
  deleteTreatment
);

module.exports = router;