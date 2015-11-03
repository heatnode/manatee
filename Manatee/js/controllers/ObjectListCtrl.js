var ObjectListCtrl = function ($scope, db, $q) {

    var self = this; //for controller as syntax later

    self.showProcs = function () {
        self.objectFocus = 'procedure';
        $q.when(db.getProcs()).then(function (result) {
            updateList(result)
        });
    }

    init();

    function init() {
        self.objects = [];
        self.showProcs();
        
    }

    function updateList(result) {
        self.objects = [];
        var allrows = result.rows;
        allrows.forEach(function (item) {
            self.objects.push(item.doc);
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
        $q.when(db.addProc(title)).then(showProcs());
            //self.objects.unshift(result);
            //showProcs();
        //});
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
        self.objectFocus = 'issue';
        //todo: refactor with "updatelist"
        $q.when(db.getIssuesForID(proc._id)).then(function (result) {
            updateList(result)
        });
    }

    self.showWorkpapers = function (proc) {
        self.objectFocus = 'workpaper';
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