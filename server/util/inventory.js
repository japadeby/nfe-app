var request = require('request');
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');
var Promise = require('bluebird');

// deve retornar o nome padrão dos produtos
function inventory(order, cnpj, app) {
  return new Promise(function (resolve, reject) {
    order.forEach(function (item) {
      // pede por ean na base, caso contrário pede por ean, e se não houver
      // considera
      // item.product.ean;

      // pede por ncm na base, caso contrário pede por ncm, e se não houver
      // considera
      // item.product.ncm;

      // se não houver ncm ou ean, pega os dados
      // item.product.code + cnpj;
      // item.product.name;
    });
  });
}

module.exports = inventory;
