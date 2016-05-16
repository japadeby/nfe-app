module.exports = function (app) {
  var router = app.loopback.Router();

  router.get('/', app.loopback.status());

  // app.get('/', function (req, res, next) {
  //   res.render('pages/index',
  //   {
  //     user: req.user,
  //     url: req.url,
  //   });
  // });
  //

  // router.get('/login', function (req, res, next) {
  //   res.render(
  //     'template/login',
  //     { user: req.user, url: req.url }
  //   );
  // });

  //
  // router.get('/auth/logout', function (req, res, next) {
  //   req.logout();
  //   res.redirect('/');
  // });

  app.use(router);
};
