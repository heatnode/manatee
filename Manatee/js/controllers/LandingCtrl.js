var LandingCtrl = function ($scope, db) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.info = {
        //hasidb: db.indexedDB,
        //hasws: db.webSQL,
        title: 'i am a title'
    }

    self.statObj = db.data;

    //self.procdata = db.

    $scope.$on('dbservicedata:updated', function () {
        //apply is necessary to trigger a digest which will update the values
        $scope.$apply();
    });

    db.updateStats();
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
LandingCtrl.$inject = ['$scope', 'databaseSvc'];
