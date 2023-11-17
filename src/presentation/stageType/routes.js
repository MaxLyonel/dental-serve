const { Router } = require('express');
const { validateJWT } = require('./../middlewares');
const { getStageTypes } = require('./controller');

const router = Router();

router.use(validateJWT);

router.get('/', getStageTypes)


module.exports = router;