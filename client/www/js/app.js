angular.module('starter', [
            'ionic', 'starter.controllers', 'starter.services',
            'lbServices', 'ngCordova', 'angular.filter', 'pouchdb',
])

.run(function ($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      window.StatusBar.styleDefault();
    }
  });
})

.constant('config', {
  // urlBase: 'http://10.0.1.6:3000',
  // urlBase: 'http://192.168.159.108:3000',
  // urlBase: 'http://192.168.100.106:3000',
  // urlBase: 'http://192.168.0.107:3000',
  urlBase: 'http://localhost:3000',
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
  })

  .state('app.nfes', {
    url: '/nfes',
    views: {
      menuNFes: {
        templateUrl: 'templates/nfes.html',
        controller: 'NFeCtrl',
      },
    },
  })

  .state('app.sources', {
    url: '/sources',
    views: {
      menuNFes: {
        templateUrl: 'templates/sources.html',
        controller: 'NFeSourcesCtrl',
      },
    },
  })

  .state('app.source-list', {
    url: '/sources/:sourceId',
    views: {
      menuNFes: {
        templateUrl: 'templates/nfes-source.html',
        controller: 'NFeSourcesListCtrl',
      },
    },
  })

  .state('app.nfe-products', {
    url: '/nfe-products',
    views: {
      menuNFes: {
        templateUrl: 'templates/nfe-products.html',
        controller: 'NFeProductsCtrl',
      },
    },
  })

  .state('app.nfe-compact', {
    url: '/nfe-compact/:nfeId',
    views: {
      menuNFes: {
        templateUrl: 'templates/nfe-compact.html',
        controller: 'NFeCompactCtrl',
      },
    },
  })

  .state('app.nfe-detail', {
    url: '/nfe-detail/:nfeId',
    views: {
      menuNFes: {
        templateUrl: 'templates/nfe-detail.html',
        controller: 'NFeDetailCtrl',
      },
    },
  });

  $urlRouterProvider.otherwise('/app/nfes');
});
