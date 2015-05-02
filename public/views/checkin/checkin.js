app.controller("CheckinCtrl", function ($scope, $http, $location, $rootScope, $window) {

    $scope.people = [];
    $scope.selected = 0;

    $http.get('/getThisTime')
        .success(function (msg) {
            $scope.people = msg;
        });

    $scope.checkIn = function (selected) {
        $http.put('/checkIn/' + selected)
            .success(function (msg) {
               $window.location.reload();
            });
    }
});