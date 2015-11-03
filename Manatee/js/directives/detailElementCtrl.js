var detailElementCtrl = function ($scope) {
    
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

}

detailElementCtrl.$inject = ['$scope'];