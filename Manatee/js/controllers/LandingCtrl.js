var LandingCtrl = function ($scope, db) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax or not?

    self.info = {
        hasidb: db.indexedDB,
        hasws: db.webSQL,
        getTotalRecs: db.getNumberRecords,
        title: 'i am a title'
    }

    $scope.$on('dbservicedata:updated', function () {
        $scope.$apply();
        //apply is necessary to trigger a digest which will update the values
        //$scope.$apply(function(){
        //    self.info.title = 'i am a title updated';
        //});
    });
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
LandingCtrl.$inject = ['$scope', 'databaseSvc'];
