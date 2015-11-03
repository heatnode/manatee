var Manatee = angular.module('Manatee', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ckeditor', 'xeditable']);

Manatee.factory('databaseSvc', databaseSvc);
Manatee.factory('syncSvc', syncSvc);
Manatee.factory('notify', notify);

Manatee.controller('LandingCtrl', LandingCtrl);
Manatee.controller('SyncCtrl', SyncCtrl);
Manatee.controller('ObjectListCtrl', ObjectListCtrl);
Manatee.controller('AlertCtrl', AlertCtrl);
Manatee.controller('ModalInstanceCtrl', ModalInstanceCtrl);
Manatee.controller('EditorModalCtrl', EditorModalCtrl);
Manatee.controller('CkeditorCtrl', CkeditorCtrl);
//Manatee.controller('AlertDemoCtrl', AlertDemoCtrl);

Manatee.directive('activeLink', activeLink);
Manatee.directive('detailElement', detailElement);
//this was borrowed
Manatee.filter('firstUpper', function () {
    return function (input, scope) {
        return input ? input.substring(0, 1).toUpperCase() + input.substring(1) : "";
    }
});

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

// this makes inline edit pretty
Manatee.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
