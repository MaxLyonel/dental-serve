const path = require('path');

const AppRoutes = async (app) => {

  app.use('/api/auth', require('./auth/routes'))
  app.use('/api/administrator', require('./admin/routes'));
  app.use('/api/role', require('./role/routes'));
  app.use('/api/patient', require('./patient/routes'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'))
  });
};

module.exports = { AppRoutes };
