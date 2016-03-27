angular.module('starter.services', ['pouchdb'])

.factory('pouchdb', function () {
  // PouchDB.sync('nfe', 'http://localhost:5984/nfe');
  return new PouchDB('nfe');
})

.factory('Crawler', ['$http', 'config', function ($http, config) {
  return {
    getNFe: function (key, callback) {
      $http
        .get(config.urlBase + '/crawler/' + key)
        .success(function (res) {
          callback(null, res);
        })
        .error(function (data) {
          callback(data);
        });
    },
  };
},
])

.factory('ValidateNfe', function () {
  function keyMod11(keyNfe) {
    var base = 9;
    var result = 0;
    var sum = 0;
    var factor = 2;
    var numbers = [];
    var partial = [];

    for (var i = keyNfe.length; i > 0; i--) {
      numbers[i] = keyNfe.substr(i - 1, 1);
      partial[i] = numbers[i] * factor;
      sum += partial[i];

      if (factor === base) {
        factor = 1;
      }

      factor++;
    }

    if (result === 0) {
      sum *= 10;
      var digit = sum % 11;

      if (digit === 10) {
        digit = 0;
      }

      return digit;
    } else if (result === 1) {
      var rest = sum % 11;
      return rest;
    }
  }

  function checkDV(keyNfe) {
    return (keyMod11(keyNfe.slice(0, -1)) === keyNfe.split('').pop());
  }

  function checkSize(keyNfe) {
    return /\d{44}/.test(keyNfe);
  }

  return {
    validate: function (keyNfe) {
      if (!checkDV(keyNfe))
        return 'Chave de Acesso ' + keyNfe + ' não é valida';
      if (!checkSize(keyNfe))
        return 'Tamanho do Chave de Acesso ' + keyNfe +
                  ' não é igual a 44 dígitos.';
      return 'OK';
    },
  };
});
