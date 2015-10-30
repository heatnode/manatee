var ObjectListCtrl = function ($scope, db, $q) {

    var self = this; //for controller as syntax later

    self.procs = [];

    self.title = "he he he suckas";

    //todo: move to object ctrl
    self.list = function () {
        self.procs = []; //note json object
        $q.when(db.getProcs()).then(function (result) {
            var allrows = result.rows;
            allrows.forEach(function (item) {
                self.procs.push(item.doc);
            });
        });
    }

    self.testSave = function () {
        //find dirty form, save?
        //console.log('test save');
    }

    self.addProc = function () {

        $q.when(db.addProc(self.title)).then(function (result) {
            self.procs.push(result);
        });

    }

    self.resolveTest = function (proc) {
        //console.log(proc);
        db.saveProc(proc);
    }

    self.list();
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ObjectListCtrl.$inject = ['$scope', 'databaseSvc','$q'];