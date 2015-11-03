var detailElement = function () {
    return {
        restrict: 'E',
        controller: detailElementCtrl,
        templateUrl: 'views/detailElement.html',
        scope: {
            //some of this is too specific, need to refactor
            ofield: '=',
            fieldname: '@',
            dataobject: '=',
            testresultfunc: '&',
            editorfunc: '&'
        }
        //link: function (scope, element, attrs) {
        //}
    };
};