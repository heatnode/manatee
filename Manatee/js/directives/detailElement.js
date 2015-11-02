var detailElement = function () {
    return {
        restrict: 'E',
        controller: detailElementCtrl,
        templateUrl: 'views/detailElement.html',
        scope: {
            objectfield: '='
        }
        //link: function (scope, element, attrs) {
        //}
    };
};