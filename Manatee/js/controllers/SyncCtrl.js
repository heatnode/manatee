var SyncCtrl = function ($scope, sync, $q) {

    var self = this; 
    self.test = sync.name;
    self.log = [];
    var i = 1;
    self.update = function () {
        self.log.push({ text: 'row ' + i });
        i = i + 1;
    }

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
            //console.log(result);
            var allrows = result.rows;
            allrows.forEach(function (item) {
                self.dbItems.push(item);
            });
        });
    }
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
SyncCtrl.$inject = ['$scope', 'syncSvc','$q'];