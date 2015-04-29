var app = angular.module("HypeApp", ["ngRoute"]);

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