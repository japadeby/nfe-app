module.exports = function(Inventory) {
  Inventory.validatesUniquenessOf('ncm', {scopedTo: ['ean'], message: 'inventory already exists'});
};
