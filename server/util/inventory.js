var request = require('request'),
    cheerio = require('cheerio'),
    iconv  = require('iconv-lite'),
    Promise = require('bluebird'),
    Ncm = require('../util/ncm');

var Inventory = function (app) {
  var updatedProducts,
      products = [],
      nfe = null;

  function setNfe(value) {
    nfe = value;
  }

  function setProducts(productList) {
    products = productList;
  }

  function loadData(nfe) {
    setNfe(nfe);
    setProducts(nfe.data.order);
    updatedProducts = 0;
  }

  function saveNfe(nfe) {
    loadData(nfe);
    products.forEach(function (item) {
      saveInventory(item.product);
    });
  }

  function createNfe() {
    if (updatedProducts === products.length) {
      app.models.nfe.create(nfe);
    }
  }

  function saveInventory(product) {
    var inventoryData = {
      ean: product.ean,
      ncm: product.ncm
    };

    if (product.ean) {
      inventoryData.description = product.name;
      setInventory(product, inventoryData);
    } else {
      Ncm.search(product.ncm).then(function (response) {
        inventoryData.description = response;
        setInventory(product, inventoryData);
      });
    }
  };

  function setInventory(product, inventoryData) {
    var query = product.ean ? { ean: product.ean } : { ncm: product.ncm }
    app.models.inventory.findOrCreate(
      { where: query },
      inventoryData,
      function (err, instance) {
        updatedProducts++;
        product.inventory_id = instance.id;
        createNfe();
      }
    );
  }

  return {
    saveNfe: saveNfe
  };
};

module.exports = Inventory;
