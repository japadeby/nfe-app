angular.module('starter.sources', ['lbServices'])

.controller('NFeSourcesCtrl', function ($scope, Nfe) {
  Nfe.find(function (nfes) {
    var sources = {};
    var total = 0;
    var count = 0;
    angular.forEach(nfes, function (nfe, key) {
      var sourceId = nfe.data.source.id;
      var value;
      count++;
      if (sources[sourceId] === undefined) {
        console.log(nfe.source);
        value = parseFloat(nfe.data.info.total);
        value = isNaN(value) ? null : value;
        total += value;
        sources[sourceId] = {
          name: nfe.source,
          id: nfe.data.source.id,
          count: 1,
          total: value,
        };
      } else {
        sources[sourceId].count++;
        value = parseFloat(nfe.data.info.total);
        value = isNaN(value) ? null : value;
        total += value;
        sources[sourceId].total += value;
      }
    });

    $scope.sourcesCount = count;
    $scope.sourcesTotal = total;
    $scope.sourcesSize = Object.keys(sources).length;
    $scope.sources = sources;
  });
});
