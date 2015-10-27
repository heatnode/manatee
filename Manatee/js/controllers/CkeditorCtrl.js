var CkeditorCtrl = function ($scope) {

    // Editor options.
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    // Called when the editor is completely ready.
    $scope.onReady = function () {
        console.log('ready');
    };
}

CkeditorCtrl.$inject = ['$scope'];