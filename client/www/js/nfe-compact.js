angular.module('starter.nfe-compact', ['lbServices'])

.controller('NFeCompactCtrl', function ($scope, $stateParams, Nfe) {
  Nfe.findById({ id: $stateParams.nfeId }, function (result) {
    $scope.nfe = result;
    if (result.data.target.id === '')
      $scope.nfe.target = 'Consumidor não identificado';
    else
      $scope.nfe.target = result.data.target.id;
  });
});
