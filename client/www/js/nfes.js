angular.module('starter.nfes', ['lbServices'])

.controller('NFeCtrl', function ($scope, $cordovaBarcodeScanner, $filter, Nfe,
                                    Crawler, ValidateNfe, pouchdb) {

  $scope.keyNfes = [];
  $scope.nfes = [];
  $scope.scanning = false;

  // TODO order by date group by month
  Nfe.find(function (result) {
    angular.forEach(result, function (nfe, key) {
      nfe._id = nfe.id;
      $scope.nfes.push(nfe);
      pouchdb.put(nfe);
      $scope.keyNfes.push(nfe.key);
    });

    $scope.nfes = $filter('orderBy')($scope.nfes, 'source');
  });

  $scope.total = function () {
    var total = 0;
    var count = 0;
    var tax = 0;
    angular.forEach($scope.nfes, function (nfe, key) {
      count++;
      var value = parseFloat(nfe.data.info.total);
      total += isNaN(value) ? null : value;
      value = parseFloat(nfe.data.totalIcms.tax);
      tax += isNaN(value) ? null : value;
    });

    return {
      count: count,
      tax: tax,
      total: total,
    };
  };

  // TODO crud nfe localStorage
  $scope.scan = function () {
    if (!$scope.scanning) {
      $scope.scanning = true;
      console.log('scanning...');
      console.log($scope.scanning);

      $cordovaBarcodeScanner.scan()
      .then(
        function (imageData) {
          var key = /\d{44}/.exec(imageData.text);
          console.log('Barcode Format -> ' + imageData.format);
          console.log('Cancelled -> ' + imageData.cancelled);
          console.log('Text -> ' + imageData.text);

          // Found URL/Product
          // imageData.format == 'QR_CODE' 'CODE_128'

          if (key == null) {
            console.log('Erro na leitura, tente novamente.');
          } else if (ValidateNfe.validate(key[0])) {
            key = key[0];

            // TODO se estiver offline aguardar
            if ($scope.keyNfes.indexOf(key) === -1) {
              Crawler.getNFe(key, function (err, nfe) {
                if (err) {
                  console.log(err);

                  //TODO 'Nota 26151109339936000701550100005106941159125973
                  // não encontrada na base do SEFAZ.'
                }

                if (nfe.msg === 'ok') {
                  $scope.keyNfes.push(key);
                  $scope.nfes.unshift(nfe);
                  console.log('Nota capturada!');
                }

                if (nfe.msg !== 'ok') {
                  console.log(nfe.msg);
                }
              });
            } else {
              console.log('Nota já foi capturada!');
            }
          }

          $scope.scanning = false;
        },

        function (error) {
          console.error('An error happened -> ' + error);
          console.log('Erro na leitura, tente novamente.');
          $scope.scanning = false;
        }
      );
    }
  };
})
