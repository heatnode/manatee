var detailElement = function () {
    return {
        restrict: 'E',
        controller: detailElementCtrl,
        templateUrl: 'js/directives/detailElement.html',
        scope: {
            //some of this is too specific, need to refactor
            ofield: '=',
            fieldname: '@',
            dataobject: '=',
            testresultfunc: '&',
            editorfunc: '&',
            savefunc: '&' //migrate others to just use this
        }
        //link: function (scope, element, attrs) {
        //}
    };
};