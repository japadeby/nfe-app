angular.module('starter.nfe-detail', ['lbServices'])

.controller('NFeDetailCtrl', function ($scope, $stateParams, Nfe) {

  Nfe.findById({ id: $stateParams.nfeId }, function (result) {
    $scope.nfe = result;
    if (result.data.target.id === '')
      $scope.nfe.target = 'Consumidor não identificado';
    else
      $scope.nfe.target = result.data.target.id;
  });

});
