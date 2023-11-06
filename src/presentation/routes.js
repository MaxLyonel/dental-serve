

const AppRoutes = async (app) => {
  // paths = {
  //   //auth
  //   auth: '/api/auth',
  //   //module users
  //   user: '/api/user',
  //   typeUser: '/api/typeuser',
  //   role: '/api/role',
  //   permision: '/api/permision',
  // };

  // // //auth
  // // app.use(paths.auth, require('./routes/auth.route'));
  // // //module users
  app.use('/api/administrator', require('./admin/routes'));
  // // app.use(paths.typeUser, require('./routes/module.user/type.user.route'));
  // // app.use(paths.role, require('./routes/module.user/role.route'));
  // // app.use(paths.permision, require('./routes/module.user/permision.route'));
  // //module reports
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'))
  });
};

module.exports = { AppRoutes };
