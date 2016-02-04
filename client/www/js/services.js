angular.module('starter.services', [])

.factory('Crawler', ['$http', 'config', function($http, config) {
  return {
    getNFe: function(key, callback){
      $http
        .get(config.urlBase+'/crawler/'+key)
        .success(function(res) {
          callback(null, res);
        })
        .error(function(data){
          callback(data);;
        });
    }
  }
}])

.factory('ValidateNfe', function() {
  function keyMod11(key_nfe) {
    base = 9;
    result = 0;
    sum = 0;
    factor = 2;
    numbers = [];
    partial = [];
    for (i = key_nfe.length; i > 0; i--) {
      numbers[i] = key_nfe.substr(i - 1, 1);
      partial[i] = numbers[i] * factor;
      sum += partial[i];
      if (factor == base) {
        factor = 1;
      }
      factor++;
    }
    if (result == 0) {
      sum *= 10;
      digit = sum % 11;
      if (digit == 10) {
        digit = 0;
      }
      return digit;
    } else if (result == 1) {
      rest = sum % 11;
      return rest;
    }
  }

  function checkDV(key_nfe){
    return (keyMod11(key_nfe.slice(0, -1)) == key_nfe.split('').pop())
  }

  function checkSize(key_nfe){
    return /\d{44}/.test(key_nfe)
  }

  return {
    validate: function(key_nfe){
      if(!checkDV(key_nfe))
        return "Chave de Acesso "+key_nfe+" não é valida"
      if(!checkSize(key_nfe))
        return "Tamanho do Chave de Acesso "+key_nfe+" não é igual a 44 dígitos."
      return "OK"
    }
  }
});
