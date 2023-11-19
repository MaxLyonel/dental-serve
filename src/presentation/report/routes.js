const { Router } = require('express');
const { validateJWT } = require('./../middlewares');
const { getInfoDashboard, getReport, getReportDocument } = require('./controller');

const router = Router();

router.use(validateJWT);

router.post('/', getReport)

router.post('/xlsx', getReportDocument)

router.get('/dashboard', getInfoDashboard);


module.exports = router;