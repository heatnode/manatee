var detailElementCtrl = function ($scope, $timeout) {
    
    //testResultFunc:"&",

    //editorFunc:"&"
    //console.log($scope.fieldname);
    //console.log($scope.ofield);
    $scope.showCKEditorModal = function () {
        //Call external scope's function
        $scope.editorfunc()($scope.dataobject, $scope.fieldname, 'title');
    };

    $scope.saveTestResults = function () {
        $scope.testresultfunc()($scope.dataobject);
    };

   // app.controller('ChildController', function ($scope, $timeout) {
    var timeout = null;
    var secondsToWaitBeforeSave = 1;

        var saveUpdates = function () {
            //if ($scope['item_' + $scope.$index + '_form'].$valid) {
            //    console.log("Saving updates to item #" + ($scope.$index + 1) + "...", $scope.item);
            //} else {
            //    console.log("Tried to save updates to item #" + ($scope.$index + 1) + " but the form is invalid.");
            //}
            $scope.savefunc()($scope.dataobject);;
        };

        var debounceUpdate = function (newVal, oldVal) {
            if (newVal != oldVal) {
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(saveUpdates, secondsToWaitBeforeSave * 1000);
            }
        };
        $scope.$watch('ofield.value', debounceUpdate);
        //$scope.$watch('item.description', debounceUpdate);
    //});

}

detailElementCtrl.$inject = ['$scope', '$timeout'];