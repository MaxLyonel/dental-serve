

const AppRoutes = async (app) => {

  app.use('/api/administrator', require('./admin/routes'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'))
  });
};

module.exports = { AppRoutes };
