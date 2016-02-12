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
  $scope.scanning = false;

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
    var count = 0;
    var tax = 0;
    angular.forEach($scope.nfes, function(nfe, key) {
      count++;
      value = parseFloat(nfe.data.info.total);
      total += isNaN(value)?null:value;
      value = parseFloat(nfe.data.total_icms.tax);
      tax += isNaN(value)?null:value;
    });
    return {'count': count, 'tax': tax, 'total':total};
  }

  // TODO crud nfe localStorage
  $scope.scan = function(){
    if(!$scope.scanning){
      $scope.scanning = true;
      console.log('scanning...');
      console.log($scope.scanning);
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        var key = /\d{44}/.exec(imageData.text);
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
        console.log("Text -> " + imageData.text);
        // Found URL/Product
        // imageData.format == 'QR_CODE' 'CODE_128'
        if(key == null){
          alert("Erro na leitura, tente novamente.");
        }else if(ValidateNfe.validate(key[0])){
          key = key[0];
          // TODO se estiver offline aguardar
          if($scope.key_nfes.indexOf(key) == -1){
            Crawler.getNFe(key, function(err, nfe){
              if(err){
                alert(err);
                //TODO "Nota 26151109339936000701550100005106941159125973 não encontrada na base do SEFAZ."
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
        }
        $scope.scanning = false;
      }, function(error) {
        console.error("An error happened -> " + error);
        alert('Erro na leitura, tente novamente.');
        $scope.scanning = false;
      });
    }
  }
})

.controller('NFeSourcesListCtrl', function($scope, $stateParams, $filter, Nfe) {
  $scope.source_nfes = [];
  // filter = {"where": {"data.source.id": $stateParams.sourceId}};
  Nfe.find(function (result) {
    angular.forEach(result, function(nfe, key) {
      if(nfe.data.source.id == $stateParams.sourceId)
        $scope.source_nfes.push(nfe);
    });
    $scope.source_nfes = $filter('orderObjectBy')($scope.source_nfes, "data.info.emission_date", true)
    $scope.title = $scope.source_nfes[0].source;
  });
  $scope.source_total = function(){
    var total = 0;
    var count = 0;
    var tax = 0;
    angular.forEach($scope.source_nfes, function(nfe, key) {
      count++;
      value = parseFloat(nfe.data.info.total);
      total += isNaN(value)?null:value;
      value = parseFloat(nfe.data.total_icms.tax);
      tax += isNaN(value)?null:value;
    });
    return {'count': count, 'tax': tax, 'total':total};
  }
})

.controller('NFeSourcesCtrl', function($scope, Nfe) {
  Nfe.find(function (nfes) {
    var sources = {};
    var total = 0;
    var count = 0;
    angular.forEach(nfes, function(nfe, key) {
      source_id = nfe.data.source.id;
      count++;
      if(sources[source_id] == undefined){
        console.log(nfe.source);
        value = parseFloat(nfe.data.info.total);
        value = isNaN(value)?null:value;
        total += value;
        sources[source_id] = {
          'name': nfe.source,
          'id': nfe.data.source.id,
          'count': 1,
          'total': value
        };
      } else {
        sources[source_id].count++;
        value = parseFloat(nfe.data.info.total);
        value = isNaN(value)?null:value;
        total += value;
        sources[source_id].total += value;
      }
    });
    $scope.sources_count = count;
    $scope.sources_total = total;
    $scope.sources_size = Object.keys(sources).length;
    $scope.sources = sources;
  });
})

.controller('NFeProductsCtrl', function($scope, Nfe) {
  Nfe.find(function (nfes) {
    $scope.products = {};
    angular.forEach(nfes, function(nfe,key ) {
      angular.forEach(nfe.data.order, function(item){
        name = item.product.name
        if ($scope.products[name] == undefined)
          $scope.products[name] = {
            'name': name,
            'count': 1,
            'unity': item.product.unity,
            'quantity': item.product.quantity,
            'total': item.product.price
          };
        else
          $scope.products[name]['count']++;
          $scope.products[name]['quantity'] += item.product.quantity;
          $scope.products[name]['total'] += item.product.price;
      });
    });
  });
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
