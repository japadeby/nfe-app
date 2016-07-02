var request = require('request'),
    cheerio = require('cheerio'),
    iconv  = require('iconv-lite'),
    Promise = require('bluebird'),
    async = require('async'),
    Ncm = require('../util/ncm');

var Inventory = function (app) {
  var products = [],
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
  }

  function saveNfe(nfe) {
    loadData(nfe);
    async.eachSeries(products, function(item, callback) {
      async.waterfall([
        async.apply(setInventoryData, item),
        findOrCreateInventory
      ], function () {
        callback();
      });
    }, function (err) {
      app.models.nfe.create(nfe, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  function setInventoryData(item, callback) {
    var product = item.product,
        inventoryData = {
          ean: product.ean,
          ncm: product.ncm
        };
    Ncm.search(product.ncm).then(function (response) {
      if (product.ean) {
        inventoryData.description = product.name;
      } else {
        inventoryData.description = response;
      }
      callback(null, product, inventoryData);
    });
  }

  function findOrCreateInventory(product, inventoryData, callback) {
    var query = product.ean ? { ean: product.ean } : { ncm: product.ncm }
    app.models.inventory.findOrCreate(
      { where: { query }},
      inventoryData,
      function (err, instance) {
        if (err) {
          console.log(err);
        }
        product.inventory_id = instance.id;
        callback();
      }
    );
  }

  function createNfe() {
    if (updatedProducts === products.length) {
      app.models.nfe.create(nfe);
      console.log("NFE Created.");
    }
  }

  return {
    saveNfe: saveNfe
  };
};

module.exports = Inventory;
