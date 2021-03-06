﻿var ObjectListCtrl = function ($scope, db, $q) {

    var self = this; //for controller as syntax later
    self.drillDownObj = null;
    self.objects = []

    self.showProcs = function () {
        self.objectFocus = 'procedure';
        self.drillDownObj = null;
        //console.log('showprocs');
        $q.when(db.getProcs()).then(function (result) {
            //console.log('update list');
            updateList(result);
        });
    }

    init();

    function init() {
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
        },
        workpaper: {
            saveToDB: db.saveWorkpaper
        }
    }

    self.saveObject = function (object) {
        return objectOperations[object.type].saveToDB(object);
    }

    self.addProc = function (title) {
        $q.when(db.addProc(title)).then(function (result) { self.showProcs(); });

    }

    self.addIssue = function (title) {
        if (self.selectedObj) {
            $q.when(db.addIssue(self.selectedObj, title)).then(function (result) {
                //...
            });
        }
    }

    self.open = function (dataobj) {
        if (self.selectedObj.type == 'workpaper') {
            $q.when(db.getBlobAsDataURL(dataobj)).then(function (dataUrl) {
                //var fileNameToSaveAs = 'mytestname.docx';
                var downloadLink = document.createElement("a");
                downloadLink.innerHTML = "Download File";
                if (window.webkitURL != null) {
                    // Chrome allows the link to be clicked
                    // without actually adding it to the DOM.
                    //downloadLink.href = window.webkitURL.createObjectURL(blob);
                    downloadLink.href = dataUrl;
                } else {
                    // Firefox requires the link to be added to the DOM
                    // before it can be clicked.
                    ///msSaveOrOpenBlob this is the MS option as well
                    //downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.href = dataUrl;
                    downloadLink.onclick = destroyClickedElement;
                    downloadLink.style.display = "none";
                    document.body.appendChild(downloadLink);
                }

                downloadLink.click();

                function destroyClickedElement(event) {
                    document.body.removeChild(event.target);
                }

            })
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
        self.drillDownObj = proc;
        $q.when(db.getWorkpapersForID(proc._id)).then(function (result) {
            updateList(result)
        });
    }

    self.addFile = function (fileHolder, e, _flow) {
        var file = fileHolder.file;
        var title = 'new wp';
        if (self.selectedObj) {
            $q.when(db.addWorkpaper(self.selectedObj, title, file)).then(function (result) {
                //...
            });
        }
    }

    self.selectedObj = null;
    self.setSelected = function (obj) {
        self.selectedObj = obj;
    };

    self.getIconClass = function (focus) {
        return {
            iconProcedure: focus == 'procedure',
            iconIssue: focus == 'issue',
            iconWorkpaper: focus == 'workpaper'
        }
    }
       
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ObjectListCtrl.$inject = ['$scope', 'databaseSvc','$q'];