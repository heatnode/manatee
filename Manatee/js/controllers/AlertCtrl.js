//var AlertCtrl = function ($scope, notify) {

//    var self = this; //for controller as syntax later
//    $scope.notify = notify
    
//    //$scope.notify.add({ title: 'test title', body: 'this is your message' });
//    $scope.$on('notificationEvent:updated', function (e, value) {
//        //apply is necessary to trigger a digest which will update the values
//        $scope.notify.add(value);
//        $scope.$apply();
//    });
//}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings



var AlertCtrl = function ($scope, notify) {
    var self = this;
    //self.alerts = [
    //  { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    //  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    //];

    self.alerts = [];
    self.addAlert = function () {
        self.alerts.push({ msg: 'Another alert!', type: 'default' });
    };

    self.closeAlert = function (index) {
        self.alerts.splice(index, 1);
    };

    //var self = this; //for controller as syntax later
    //$scope.notify = notify

    //$scope.notify.add({ title: 'test title', body: 'this is your message' });
    $scope.$on('notificationEvent:itemAdded', function (e, value) {
        //apply is necessary to trigger a digest which will update the values
        //$scope.notify.add(value);
        //obviously could clean up formatting
        var item = notify.pop();
        //var alertmsg = item.title + ': ' + item.body + ' saved';
        var alertmsg = '[ ' + item.body + ' saved ]';
        self.alerts.push({ msg: alertmsg, type: 'default' });
        $scope.$apply();
    });
};

AlertCtrl.$inject = ['$scope', 'notify'];