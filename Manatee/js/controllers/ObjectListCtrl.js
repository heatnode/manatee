var ObjectListCtrl = function ($scope, db, $q) {

    var self = this; //for controller as syntax later
    self.drillDownObj = null;
    self.showProcs = function () {
        self.objectFocus = 'procedure';
        self.drillDownObj = null;
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
        return objectOperations[object.type].saveToDB(object);
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
        return db.saveProc(proc);
    }

    self.showIssues = function(proc) {
        self.objectFocus = 'issue';
        self.drillDownObj = proc;
        $q.when(db.getIssuesForID(proc._id)).then(function (result) {
            updateList(result)
        });
    }

    self.showWorkpapers = function (proc) {
        self.objectFocus = 'workpaper';
        console.log(proc._id);
    }

    self.addFile = function (file, _flow) {
        //file.name
        //file.msg
        console.log('file');
        console.log(file);
        console.log('flow');
        console.log(_flow);
        ////var f = document.getElementById('file').files[0],
        //reader = new FileReader();
        //reader.onloadend = function (e) {
        //    var data = e.target.result;
        //    //send your binary data via $http or $resource or do anything else with it
        //}
        //reader.readAsArrayBuffer(f);

        //var reader = new FileReader();

        ///* Using a closure so that we can extract the 
        //   File's attributes in the function. */
        //reader.onload = (function (file) {
        //    return function (e) {
        //        pdb.putAttachment(response.id, file.name, response.rev, e.target.result, file.type);
        //    };
        //})(form.attachment.files.item(0));
        //reader.readAsDataURL(form.attachment.files.item(0));

    }

    self.selectedObj = null;
    self.setSelected = function (obj) {
        self.selectedObj = obj;
    };
       
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ObjectListCtrl.$inject = ['$scope', 'databaseSvc','$q'];