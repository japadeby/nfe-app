module.exports = function(Cnae) {
  Cnae.validatesUniquenessOf("cnpj", {message: 'cna already exists.'});
};
