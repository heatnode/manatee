var notify = function ($rootScope) {

    //from: http://www.bootply.com/fqI3oR8noq
    //maybe do something like this in the future (to fade it)
    //http://stackoverflow.com/questions/18844141/angularjs-ui-bootstrap-fading-out-alert-on-remove
    var queue = [];
    var service = {
        queue: queue,
        add: function (item) {
            queue.push(item);
            //todo: try to broadcast on service?
            $rootScope.$broadcast('notificationEvent:itemAdded', item);
            //setTimeout(function () {
            //    var alertsContainer = document.getElementsByClassName('alerts');
            //    var wrappedResult = angular.element(alertsContainer);
            //    var alerts = wrappedResult[0].getElementsByClassName('alert');
            //    var wrappedAlerts = angular.element(alerts);
            //    wrappedAlerts[0].remove();
            //    queue.shift();
            //}, 1000);
        },
        pop: function () {
            return this.queue.pop();
        }
    };

    return service;

};

notify.$inject = ['$rootScope'];