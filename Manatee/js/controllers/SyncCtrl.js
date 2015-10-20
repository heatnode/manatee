var SyncCtrl = function ($scope, sync, $q) {

    var self = this; 
    self.test = sync.name;
    self.log = [];
    var i = 1;
    self.update = function () {
//        self.log = 'updated!';
        self.log.push({ text: 'row ' + i });
        i = i + 1;
    }

    self.runSync = function () {
        //        self.log = 'updated!';
        //self.log = [];
        //self.log.push({ text: 'row ' + i });
        //i = i + 1;
        sync.doSync();
        self.log.push({ text: 'sync completed but maybe not- consider async' });
    }

    //todo: move to object ctrl
    self.add = function () {
        var text = self.title || 'Test';
        var proc = sync.db.addProc(text);
        self.log.push({ text: text + ' added' });
    }

    //todo: move to object ctrl
    self.list = function () {
        self.dbItems = []; //note json object
        $q.when(sync.db.getProcs()).then(function (result) {
            //console.log(result);
            var allrows = result.rows;
            allrows.forEach(function (item) {
                self.dbItems.push(item);
            });
        });
        //var allrows = sync.db.getProcs();

    }

    //inputEditTodo.id = 'input_' + todo._id;
    //inputEditTodo.className = 'edit';
    //inputEditTodo.value = todo.title;
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
SyncCtrl.$inject = ['$scope', 'syncSvc','$q'];