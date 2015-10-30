var EditorModalCtrl = function ($scope, $uibModal, $log) {
    var self = this;
    //self.items = ['item1', 'item2', 'item3'];
   // self.text = "";

    //$scope.animationsEnabled = true;
    //obj is a business obj (i.e control, procedure)
    self.open = function (obj, fieldForValue, fieldForTitle) {

        //var opObj = obj;

        var editorData = {
            content: obj[fieldForValue].value,
            title: obj[fieldForTitle], //todo: convert to object instead of just .title
            label: fieldForValue
        };
        
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/editorModal.html',
                controller: 'ModalInstanceCtrl as MIC',
               // size: 'lg',
                resolve: {
                    //items: function () {
                    //    return self.items;
                    //},
                    dataForInstance: function () {
                        return editorData;
                    },
                }
            });

            modalInstance.result.then(function (returnObj) {
               // $scope.selected = obj.selectedItem;
                // console.log(obj.text);
                //self.text = obj.text;
                obj[fieldForValue].value = returnObj.content;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    //self.toggleAnimation = function () {
    //    self.animationsEnabled = !self.animationsEnabled;
    //};

}
//$uibModal is the service
EditorModalCtrl.$inject = ['$scope', '$uibModal','$log'];


//this seems to be instantiated via the modal controller
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
var ModalInstanceCtrl = function ($scope, $uibModalInstance, dataForInstance) {
    var self = this;
    //self.items = items;
    self.content = dataForInstance.content;
    self.title = dataForInstance.title;
    self.label = dataForInstance.label;

    //$scope.selected = {
    //    item: self.items[0]
    //};

    $scope.ok = function () {
       // console.log(self.content);
        var retObj = { content: self.content };
        $uibModalInstance.close(retObj);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
//ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'items'];