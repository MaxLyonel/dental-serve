const { Router } = require('express');
const { validateJWT } = require('./../middlewares');
const { getTheths } = require('./controller');

const router = Router();

router.use(validateJWT);

router.get('/', getTheths)


module.exports = router;