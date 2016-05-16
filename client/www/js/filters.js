angular.module('starter.filters', [])

// https://github.com/fmquaglia/ngOrderObjectBy
// field | orderObjectBy:'source':false
// $scope.nfes = $filter('orderObjectBy')(field, 'same.value')
.filter('orderObjectBy', function () {
  return function (items, field, reverse) {
    var filtered = [];

    angular.forEach(items, function (item) {
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

    if (reverse) filtered.reverse();

    return filtered;
  };
});
