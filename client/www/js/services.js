angular.module('starter.services', ['pouchdb', 'ionic', 'lbServices'])

.factory('pouchdb', function () {
  // PouchDB.sync('nfe', 'http://10.0.1.6:5984/nfe');
  return new PouchDB('nfe');
})

// .factory('Crawler', ['$http', 'config', function ($http, config) {
.factory('Crawler', ['$http', function ($http) {
  return {
    getNFe: function (key, callback) {
      $http
        .get('http://localhost:3000/crawler/' + key) //config.serverUrlBase
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

.factory('LoginFacebook', function ($location) {
  return function () {
    var url = 'http://localhost:3000/auth/facebook';
    // var ref = window.open(url, '_blank');
    var ref = window.open(url, '_blank', 'location=no');

    // For Cordova
    if (window.cordova) {
      ref.addEventListener('loadstop', function (ev) {
        if (ev.url.indexOf('/auth/facebook/callback') !== -1) {
          ref.close();
          $location.path('/app/nfes');
        }
      });
    } else {
      // For `ionic serve --lab`. Wait for the user to close the window
      // and, when they do, check the server to see if they're now logged in.
      var interval = setInterval(function () {
        if (ref.closed) {
          $location.path('/app/nfes');
          clearInterval(interval);
        }
      }, 1000);
    }
  };
})

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
