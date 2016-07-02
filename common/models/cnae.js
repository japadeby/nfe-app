module.exports = function(Cnae) {
  Cnae.validatesUniquenessOf("data", {message: 'cna already exists.'});
};
