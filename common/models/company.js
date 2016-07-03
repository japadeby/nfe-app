module.exports = function(Company) {
  Company.validatesUniquenessOf("cnpj", {message: 'company already exists.'});
};
