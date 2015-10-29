var EditorModalCtrl = function ($scope, $uibModal, $log) {
    //todo: work on scoping
    var self = this;
    self.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (size, mytxtOrMyProp) {
        $scope.text = mytxtOrMyProp;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/editorModal.html',
                controller: 'ModalInstanceCtrl as MIC',
                size: size,
                resolve: {
                    items: function () {
                        return self.items;
                    },
                    text: function () {
                        return self.text;
                    },
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}
//$uibModal is the service
EditorModalCtrl.$inject = ['$scope', '$uibModal','$log'];


//this seems to be instantiated via the modal controller
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
var ModalInstanceCtrl = function ($scope, $uibModalInstance, items, text) {
    console.log(text);
    var self = this;
    self.items = items;

    $scope.selected = {
        item: self.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
//ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'items'];