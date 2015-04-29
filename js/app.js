var app = angular.module("Checkin", ["ngRoute"]);

app.config(function ($routeProvider, $httpProvider, $locationProvider, $sceProvider) {

    $sceProvider.enabled(false);

    $routeProvider
        .when('/home', {
            templateUrl: 'views/checkin/checkin.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
});