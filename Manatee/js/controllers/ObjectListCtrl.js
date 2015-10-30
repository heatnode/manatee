var ObjectListCtrl = function ($scope, db, $q) {

    var self = this; //for controller as syntax later

    self.procs = [];
    
    //todo: move to object ctrl
    self.list = function () {
        self.procs = []; 
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

    self.addProc = function (title) {

        $q.when(db.addProc(title)).then(function (result) {
            self.procs.push(result);
        });

    }

    self.resolveTest = function (proc) {
        //console.log(proc);
        db.saveProc(proc);
    }
    // new
    self.selectedId = null;
    self.setSelected = function (id) {
        self.selectedId = id;
    };
    //endnew

    self.list();
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ObjectListCtrl.$inject = ['$scope', 'databaseSvc','$q'];