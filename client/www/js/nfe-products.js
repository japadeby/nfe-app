angular.module('starter.nfe-products', ['lbServices'])

.controller('NFeProductsCtrl', function ($scope, Nfe) {
  Nfe.find(function (nfes) {
    $scope.products = {};
    angular.forEach(nfes, function (nfe, key) {
      angular.forEach(nfe.data.order, function (item) {
        var name = item.product.name;
        if ($scope.products[name] === undefined)
          $scope.products[name] = {
            name: name,
            count: 1,
            unity: item.product.unity,
            quantity: item.product.quantity,
            total: item.product.price,
          };
        else {
          $scope.products[name].count++;
          $scope.products[name].quantity += item.product.quantity;
          $scope.products[name].total += item.product.price;
        }
      });
    });
  });
});
