var Manatee = angular.module('Manatee', ['ngRoute', 'ui.bootstrap']);

Manatee.factory('databaseSvc', databaseSvc);
Manatee.factory('syncSvc', syncSvc);
Manatee.factory('notify', notify);

Manatee.controller('LandingCtrl', LandingCtrl);
Manatee.controller('SyncCtrl', SyncCtrl);
Manatee.controller('ObjectListCtrl', ObjectListCtrl);
Manatee.controller('AlertCtrl', AlertCtrl);
Manatee.controller('EditorModalCtrl', EditorModalCtrl);
Manatee.controller('ModalInstanceCtrl', ModalInstanceCtrl);

Manatee.directive('activeLink', activeLink);

var configFunction = function ($routeProvider) {
    $routeProvider.
        when('/landing', {
            templateUrl: 'views/landing.html',
        })
        .when('/sync', {
            templateUrl: 'views/sync.html',
        })
        .when('/list', {
            templateUrl: 'views/objectlist.html',
        })
        .when('/test', {
            templateUrl: 'views/testzone.html',
        })
        .otherwise({
            redirectTo: 'landing'
        });
}
configFunction.$inject = ['$routeProvider'];

Manatee.config(configFunction);