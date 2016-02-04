angular.module('starter.controllers', ['lbServices'])

// https://github.com/fmquaglia/ngOrderObjectBy
// field | orderObjectBy:'source':false
// $scope.nfes = $filter('orderObjectBy')(field, "same.value")
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    function index(obj, i) {
      return obj[i];
    }
    filtered.sort(function (a, b) {
      var comparator;
      var reducedA = field.split('.').reduce(index, a);
      var reducedB = field.split('.').reduce(index, b);
      // if (isNumeric(reducedA) && isNumeric(reducedB)) {
      //   reducedA = Number(reducedA);
      //   reducedB = Number(reducedB);
      // }
      if (reducedA === reducedB) {
        comparator = 0;
      } else {
        comparator = reducedA > reducedB ? 1 : -1;
      }
      return comparator;
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

.controller('AppCtrl', function($scope) {

})

.controller('NFeCtrl', function($scope, $cordovaBarcodeScanner, $filter, Nfe, Crawler, ValidateNfe) {

  $scope.key_nfes = [];
  $scope.nfes = [];

  // TODO order by date group by month
  Nfe.find(function (result) {
    angular.forEach(result, function(nfe, key) {
      $scope.nfes.push(nfe);
      $scope.key_nfes.push(nfe.key);
    });
    $scope.nfes = $filter('orderBy')($scope.nfes, "source")
  });

  $scope.total = function(){
    var total = 0;
    var count = 0
    angular.forEach($scope.nfes, function(nfe, key) {
      count++;
      value = parseFloat(nfe.data.info.total);
      total += isNaN(value)?null:value;
    });
    return [count, total];
  }

  // TODO crud nfe localStorage
  $scope.scan = function(){
    $cordovaBarcodeScanner.scan().then(function(imageData) {
      var key = /\d{44}/.exec(imageData.text)[0];
      if(imageData.format == 'QR_CODE' && ValidateNfe.validate(key)){
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
        // TODO se estiver offline aguardar
        if($scope.key_nfes.indexOf(key) == -1){
          Crawler.getNFe(key, function(err, nfe){
            if(err){
              alert(err);
            }
            if(nfe.msg == 'ok'){
              $scope.key_nfes.push(key);
              $scope.nfes.unshift(nfe);
              alert("Nota capturada!");
            }
            if(nfe.msg != 'ok'){
              alert(nfe.msg)
            }
          });
        }else{
          alert("Nota já foi capturada!");
        }
      }else{
        alert("Erro na leitura, tente novamente.");
      }
    }, function(error) {
      console.error("An error happened -> " + error);
      alert('Erro na leitura, tente novamente.');
    });
  }
})

.controller('NFeCompactCtrl', function($scope, $stateParams, Nfe) {
  Nfe.findById({ id: $stateParams.nfeId }, function (result) {
    $scope.nfe = result;
    if(result.data.target.id == '')
      $scope.nfe.target = 'Consumidor não identificado'
    else
      $scope.nfe.target = result.data.target.id
  });
})

.controller('NFeDetailCtrl', function($scope, $stateParams, Nfe) {
  Nfe.findById({ id: $stateParams.nfeId }, function (result) {
    $scope.nfe = result;
    if(result.data.target.id == '')
      $scope.nfe.target = 'Consumidor não identificado'
    else
      $scope.nfe.target = result.data.target.id
  });
});
