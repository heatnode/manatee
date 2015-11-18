var SyncCtrl = function ($scope, sync, $q, $filter) {

    var self = this; 
    self.test = sync.name;
    self.log = [];
    var i = 1;
    self.update = function () {
        self.log.push({ text: 'row ' + i });
        i = i + 1;
    }

    //self.crypt = {
    //    key: sync.db.cryptKeeper.key,
    //    useEncryption: sync.db.cryptKeeper.useEncryption
    //};
    self.crypt = sync.db.cryptKeeper;

    $scope.$watch(angular.bind(this, function () {
        return this.crypt;
    }), function (newVal) {
        sync.db.cryptKeeper = newVal;
    },true); //deep watch


    self.runSync = function () {
        sync.doSyncWithClear();
        self.log.push({ text: 'sync completed' });
    }

    self.makeData = function () {
        sync.doSync();
        self.log.push({ text: 'sync completed' });
    }

    //todo: move to object ctrl
    self.add = function () {
        var text = self.title || 'Test';
        sync.db.addProc(text);
        self.log.push({ text: text + ' added' });
    }

    self.list = function () {
        self.dbItems = []; 
        $q.when(sync.db.getProcs()).then(function (result) {
            var allrows = result.rows;
            allrows.forEach(function (item) {
                self.dbItems.push(item);
            });
        });
    }
    //==================encryption demo==============
    self.demoData = {
        EncItems: [],
        DecItems:[],
        showAttach: false
    }

    //self.demoData.DecItems.push({ _id: 'testid', title: 'test title' });

    var populateAry = function (ary, result) {
        var allrows = result.rows;
        allrows.forEach(function (item) {
            ary.push(item);
        });
        return true;
    };

    var populateAryWithAttach = function (ary, result) {
        var allrows = result.rows;
        allrows.forEach(function (item) {
            item.attachSubStr = $filter('limitTo')(item.doc._attachments.filename.data, 100);
            ary.push(item);
        });
        return true;
    };

    self.listProcsForCompare = function () {
        self.demoData.EncItems = [];
        self.demoData.DecItems = [];
        self.demoData.showAttach = false;

        $q.when(sync.db.getProcs()).then(function (result) {
            populateAry(self.demoData.DecItems, result);
        })
        .then(function () {
            sync.db.cryptKeeper.useEncryption = false;
            return true;
        })
        .then(function () { 
            return sync.db.getProcs();
        })
        .then(function (result) {
            populateAry(self.demoData.EncItems, result);
            sync.db.cryptKeeper.useEncryption = true;
        });
    }

    self.listWorkpapersForCompare = function () {
        self.demoData.EncItems = [];
        self.demoData.DecItems = [];
        self.demoData.showAttach = true;

        $q.when(sync.db.getWorkpapersWithAttachments()).then(function (result) {
            populateAryWithAttach(self.demoData.DecItems, result);
        })
        .then(function () {
            sync.db.cryptKeeper.useEncryption = false;
            return true;
        })
        .then(function () {
            return sync.db.getWorkpapersWithAttachments();
        })
        .then(function (result) {
            populateAryWithAttach(self.demoData.EncItems, result);
            sync.db.cryptKeeper.useEncryption = true;
        });
    }

    //=============== end encryption demo=================
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
SyncCtrl.$inject = ['$scope', 'syncSvc', '$q', '$filter'];