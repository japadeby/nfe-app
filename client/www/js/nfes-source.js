angular.module('starter.nfes-source', ['lbServices'])

.controller('NFeSourcesListCtrl',
              function ($scope, $stateParams, $filter, Nfe) {
  $scope.sourceNfes = [];

  // filter = {'where': {'data.source.id': $stateParams.sourceId}};
  Nfe.find(function (result) {
    angular.forEach(result, function (nfe, key) {
      if (nfe.data.source.id === $stateParams.sourceId)
        $scope.sourceNfes.push(nfe);
    });

    $scope.sourceNfes = $filter('orderObjectBy')($scope.sourceNfes,
                            'data.info.emissionDate', true);
    $scope.title = $scope.sourceNfes[0].source;
  });

  $scope.sourceTotal = function () {
    var total = 0;
    var count = 0;
    var tax = 0;
    angular.forEach($scope.sourceNfes, function (nfe, key) {
      count++;
      var value = parseFloat(nfe.data.info.total);
      total += isNaN(value) ? null : value;
      value = parseFloat(nfe.data.totalIcms.tax);
      tax += isNaN(value) ? null : value;
    });

    return {
      count: count,
      tax: tax,
      total:total,
    };
  };
});
