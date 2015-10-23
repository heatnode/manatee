﻿var AlertCtrl = function ($scope, notify) {

    var self = this; //for controller as syntax later
    $scope.notify = notify
    
    $scope.notify.add({ title: 'test title', body: 'this is your message' });
    $scope.$on('notificationEvent:updated', function (e, value) {
        $scope.notify.add(value);
        $scope.$apply();

        //apply is necessary to trigger a digest which will update the values
        //$scope.$apply(function(){
        //    self.info.title = 'i am a title updated';
        //});
    });
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
AlertCtrl.$inject = ['$scope', 'notify'];