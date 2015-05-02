var app = angular.module("Checkin", ["ngRoute"]);

app.config(function ($routeProvider, $httpProvider, $locationProvider, $sceProvider) {

    $sceProvider.enabled(false);

    $routeProvider
        .when('/home', {
            templateUrl: 'views/checkin/checkin.html',
            controller: 'CheckinCtrl',
            resolve: {
                loggedin: isLoggedIn
            }
        })
        .when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/admin', {
            templateUrl: 'views/admin/admin.html',
            resolve: {
                loggedin: isLoggedIn
            }
        })
        .when('/register', {
            templateUrl: 'views/register/register.html',
            controller: 'RegisterCtrl',
            resolve: {
                loggedin: isLoggedIn
            }
        })
        .when('/verify', {
            templateUrl: 'views/verify/verify.html',
            controller: 'VerifyCtrl',
            resolve: {
                loggedin: isLoggedIn
            }
        })
        .otherwise({
            redirectTo: '/home'
        });
});

var isLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user) {
            $rootScope.currentUser = user;

            deferred.resolve();
        } else {
            $rootScope.errorMessage = 'You must login to access that page.';
            deferred.reject();
            $location.url('/login');
        }
    });

    return deferred.promise;
};