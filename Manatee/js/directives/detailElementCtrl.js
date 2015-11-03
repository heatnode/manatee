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

    var timeout = null;
    var secondsToWaitBeforeSave = 1;
    var saveUpdates = function () {

            //if ($scope['item_' + $scope.$index + '_form'].$valid) {
            //    console.log("Saving updates to item #" + ($scope.$index + 1) + "...", $scope.item);
            //} else {
            //    console.log("Tried to save updates to item #" + ($scope.$index + 1) + " but the form is invalid.");
        //}
        //might need to store this on the object b/c it's shared
        if (!$scope.dataobject.saveInProgress) { 
            $scope.savefunc()($scope.dataobject)
            .then(function () {
                $scope.dataobject.saveInProgress = false;
            });
            $scope.dataobject.saveInProgress = true;
        }
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

}

detailElementCtrl.$inject = ['$scope', '$timeout'];