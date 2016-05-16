angular.module(
  'starter',
  [
    'starter.app-ctrl',
    'starter.nfes',
    'starter.nfe-products',
    'starter.nfe-detail',
    'starter.nfe-compact',
    'starter.nfes-source',
    'starter.sources',
    'starter.login',
    'starter.register',
    'starter.filters',
    'starter.services',
    'lbServices',
    'ngCordova',
    'angular.filter',
    'pouchdb',
    'ionic',
  ]
)

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

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl',
  })

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
