app.controller("VerifyCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.pass = null;

    $scope.verify = function (pass) {
        if (pass == $rootScope.currentUser.password) {
            $location.url('/admin');
        } else {
            $location.url('/home');
        }
    }
});
