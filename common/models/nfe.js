module.exports = function (Nfe) {
  Nfe.validatesUniquenessOf('key', {message: 'nfe already exists.'});
};
