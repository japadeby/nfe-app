angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'lbServices', 'ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant('config', {
    urlBase: "http://10.0.1.6:3000"
    // urlBase:  "http://192.168.100.103:3000"
    // urlBase:  "http://localhost:3000"
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.nfes', {
    url: '/nfes',
    views: {
      'menuNFes': {
        templateUrl: 'templates/nfes.html',
        controller: 'NFeCtrl'
      }
    }
  })

  .state('app.nfe-compact', {
    url: '/nfe-compact/:nfeId',
    views: {
      'menuNFes': {
        templateUrl: 'templates/nfe-compact.html',
        controller: 'NFeCompactCtrl'
      }
    }
  })

  .state('app.nfe-detail', {
    url: '/nfe-detail/:nfeId',
    views: {
      'menuNFes': {
        templateUrl: 'templates/nfe-detail.html',
        controller: 'NFeDetailCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/nfes');
});
