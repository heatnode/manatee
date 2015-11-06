var detailElementCtrl = function ($scope, $timeout, $filter) {
    
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

//---------workflow dropdown, would factor out -------------
    if ($scope.ofield.type == 'workflow') {
        //$scope.user = {
        //    status: 2
        //};

        //$scope.statuses = [
        //  { value: 1, text: 'status1' },
        //  { value: 2, text: 'status2' },
        //  { value: 3, text: 'status3' },
        //  { value: 4, text: 'status4' }
        //];

        $scope.showWFStatus = function () {
            var selected = $filter('filter')($scope.ofield.options, { value: $scope.ofield.value });
            //return selected[0].text;
            return ($scope.ofield.options && selected.length) ? selected[0].text : 'Not set';
        };
    }
    //---------end workflow dropdown, would factor out -------------
}



detailElementCtrl.$inject = ['$scope', '$timeout', '$filter'];