angular.module('starter.login', ['lbServices', 'ionic', 'starter.services'])

.controller('LoginCtrl', function ($scope, User, $location, $ionicPopup, LoginFacebook) {

  if (User.getCachedCurrent() !== null) {
    $location.path('app/nfes');
  }

  /**
  * Currently you need to initialiate the variables
  * you use whith ng-model. This seems to be a bug with
  * ionic creating a child scope for the ion-content directive
  */
  $scope.credentials = {};

  /**
  * @name showAlert()
  * @param {string} title
  * @param  {string} errorMsg
  * @desctiption
  * Show a popup with the given parameters
  */
  $scope.showAlert = function (title, errorMsg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: errorMsg,
    });
    alertPopup.then(function (res) {
      console.log($scope.loginError);
    });
  };

  /**
  * @name login()
  * @description
  * sign-in function for users which created an account
  */
  $scope.login = function () {
    $scope.loginResult = User.login(
      {
        email: $scope.credentials.username,
        password: $scope.credentials.password,
      },
      $scope.credentials,
      function () {
        var next = $location.nextAfterLogin || '/app/nfes';
        $location.nextAfterLogin = null;
        $location.path(next);
      },

      function (err) {
        $scope.loginError = err;

        // $scope.showAlert(err.statusText, err.data.error.message);
        $scope.showAlert(err.statusText, err.data);
      }
    );
  };

  $scope.loginFacebook = function () {
    LoginFacebook();
  };

  $scope.goToRegister = function () {
    $location.path('/register');
  };

});
