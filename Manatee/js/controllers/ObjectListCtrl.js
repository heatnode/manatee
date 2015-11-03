var ObjectListCtrl = function ($scope, db, $q) {

    var self = this; //for controller as syntax later

    init();

    function init() {
        self.objects = [];
        updateList();
        self.objectFocus = 'procedure';
    }

    function updateList() {
        
        $q.when(db.getProcs()).then(function (result) {
            self.objects = [];
            var allrows = result.rows;
            allrows.forEach(function (item) {
                self.objects.push(item.doc);
            });
        });
    }

    var objectOperations = {
        procedure: {
            saveToDB: db.saveProc
        },
        issue: {
            saveToDB: db.saveIssue
        }
    }

    self.saveObject = function (object) {
        objectOperations[object.type].saveToDB(object);
    }

    self.addProc = function (title) {
        $q.when(db.addProc(title)).then(function (result) {
            //self.objects.unshift(result);
            updateList();
        });
    }

    self.addIssue = function (title) {
        if (self.selectedObj) {
            $q.when(db.addIssue(self.selectedObj, title)).then(function (result) {
                //self.objects.unshift(result);
            });
        }
    }

    self.resolveTest = function (proc) {
        db.saveProc(proc);
    }

    self.showIssues = function(proc) {
        self.objectFocus = 'issues';
        console.log(proc._id);
    }
    self.showWorkpapers = function (proc) {
        self.objectFocus = 'workpapers';
        console.log(proc._id);
    }
    //may be  too shallow (fields)
    //$watchCollection('self.objects', function () { });

    // new
    self.selectedObj = null;
    self.setSelected = function (obj) {
        self.selectedObj = obj;
    };
    //endnew

    
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ObjectListCtrl.$inject = ['$scope', 'databaseSvc','$q'];