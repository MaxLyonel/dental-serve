const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('./../../config');
const { validateJWT } = require('./../middlewares');
const { createPayment, updatePayment, deletePayment } = require('./controller');

const router = Router();

router.use(validateJWT);


router.post(
  '/',
  [
    check('treatmentId', 'Es necesario el id del tratamiento').not().isEmpty(),
    check('amount', 'Es necesario el monto de pago').isDecimal(),
    check('discount', 'Es necesario el monto de descuento').isDecimal(),
    check('typeDiscount', 'Es necesario el tipo de descuento').not().isEmpty(),
    validateFields
  ],
  createPayment
);

router.put(
  '/:paymentId',
  [
    check('treatmentId', 'Es necesario el id del tratamiento').not().isEmpty(),
    check('amount', 'Es necesario el monto de pago').not().isEmpty(),
    check('discount', 'Es necesario el monto de descuento').not().isEmpty(),
    check('typeDiscount', 'Es necesario el tipo de descuento').not().isEmpty(),
    validateFields
  ],
  updatePayment
);

router.delete(
  '/:paymentId',
  deletePayment
);

module.exports = router;