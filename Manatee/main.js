var Manatee = angular.module('Manatee', ['ngRoute', 'ui.bootstrap']);

Manatee.factory('databaseSvc', databaseSvc);
Manatee.factory('syncSvc', syncSvc);
Manatee.controller('LandingCtrl', LandingCtrl);
Manatee.controller('SyncCtrl', SyncCtrl);
Manatee.directive('activeLink', activeLink);

var configFunction = function ($routeProvider) {
    $routeProvider.
        when('/landing', {
            templateUrl: 'views/landing.html',
        })
        .when('/sync', {
            templateUrl: 'views/sync.html',
        })
        .when('/test', {
            templateUrl: '',
        })
        .otherwise({
            redirectTo: 'landing'
        });
}
configFunction.$inject = ['$routeProvider'];

Manatee.config(configFunction);