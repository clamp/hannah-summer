app.controller("RegisterCtrl", function ($scope, $http, $location, $rootScope) {

    $scope.user = {};

    //Register a user for the website
    $scope.register = function (user) {
        if (!user.username) {
            $rootScope.message = "You did not provide a username.";
        } else if (user.password != user.password2 || !user.password || !user.password2) {
            $rootScope.message = "The passwords entered do not match.";
        } else {
            $http.post("/register", user)
                .success(function (response) {
                    console.log(response);
                    if (response != null) {
                        $rootScope.currentUser = response;
                        $location.url("/admin");
                    } else {
                        $rootScope.message = "A user with that username already exists.";
                    }
                });
        }
    };
});