var PassportConfigurator =
  require('loopback-component-passport').PassportConfigurator;

module.exports = function (app) {
  var passportConfigurator = new PassportConfigurator(app);

  passportConfigurator.init();
  passportConfigurator.setupModels({
    userModel: app.models.User,
    userIdentityModel: app.models.UserIdentity,
    userCredentialModel: app.models.UserCredential,
  });

  passportConfigurator.configureProvider('facebook-login',
    require('../../providers.json')['facebook-login']);

  // var config = {};
  // try {
  //   config = require('../providers.json');
  // } catch (err) {
  //   console.trace(err);
  //   process.exit(1); // fatal
  // }
  //
  // for (var s in config) {
  //   var c = config[s];
  //   c.session = c.session !== false;
  //   passportConfigurator.configureProvider(s, c);
  // }
};
