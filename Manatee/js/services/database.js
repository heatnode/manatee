var databaseSvc = function ($rootScope) {

    var service = {};
    var db;

    service.createDB = function () {
        db = new PouchDB('manateeStore');
        //todo: long term don't expose this obviously
        service.db = db;
    }

    service.createDB();

    service.findObject = function (id) {
        return db.find({
            selector: { '_id': id },
            fields: ['_id', '_rev']
        });
    }

    service.reInitDB = function () {
        return db.destroy().then(function () {
            db = new PouchDB('manateeStore');
            service.db = db;
        })
    };

    function createProc(id, title) {
        var dbID = 'procedure_' + id;
        var proc = {
            _id: dbID,
            type: "procedure",
            IssuesCount: 0,
            WorkpapersCount: 0,
            fields: {
                title: {
                    //later add .label for normalized label
                    value: title,
                    type: "string",
                    validations: { required: true }
                },
                completed: {
                    value: false,
                    type: "bool",
                    validations: {}
                },
                datedue: {
                    value: "",
                    type: "date",
                    validations: {}
                },
                result: {
                    value: 0,
                    type: "testresult",
                    options: [{ text: 'NONE', optvalue: 0 }, { text: 'pass', optvalue: 1 }, { text: 'fail', optvalue: 2 }],
                    validations: {}
                },
                category1: {
                    value: 0,
                    type: "singleselect",
                    options: [{ text: 'NONE', optvalue: 1 }, { text: 'cat1', optvalue: 1 }, { text: 'cat2', optvalue: 2 }],
                    validations: {}
                },
                description: {
                    value: "",
                    type: 'html',
                    validations: {}
                },
                //example of field with spaces, may not need if we do label prop
                "Record of Work": {
                    value: "",
                    type: 'html',
                    validations: {}
                }
            }
        };
        return proc;
    }

    function createIssue(id, procId, title) {
        var dbID = procId + '_issue_' + id;
        console.log(dbID);
        var issue = {
            _id: dbID,
            type: "issue",
            fields: {
                title: {
                    //later add .label for normalized label
                    value: title,
                    type: "string",
                    validations: { required: true }
                },
                code: {
                    value: "",
                    type: "string",
                    validations: {}
                },
                release: {
                    value: false,
                    type: "release",
                    validations: {}
                },
                finding: {
                    value: "",
                    type: "html",
                    validations: {}
                },
                levels: {
                    value: "",
                    type: "html",
                    validations: {}
                }
            }
        };
        return issue;
    }

    service.addProc = function (title) {
        var proc; //using closure so we have the value in the final step
        return getSeqNumber()
            .then(function (id) {
                proc = createProc(id, title);
                //console.log(proc);
                return service.db.put(proc);
            })
            .then(function (response) {
                console.log('proc added');
                return proc;
            })
            .catch(function (err) {
                //todo: let error bubble or throw error if it didn't work
                console.log(err);
            });
    }

    service.addIssue = function (proc, title) {
        var issue; //using closure so we have the value in the final step
        return getSeqNumber()
            .then(function (id) {
                issue = createIssue(id, proc._id, title);
                console.log(issue);
                return service.db.put(issue);
            })
            .then(function (response) {
                //update proc
                proc.IssuesCount = proc.IssuesCount + 1;
                return saveObject(proc);
            })
            .then(function (updatedProc) {
                return updatedProc;
            })
            .catch(function (err) {
                //todo: let error bubble or throw error if it didn't work
                console.log(err);
            });
    }

    service.saveProc = function (proc) {
        saveObject(proc);
    }

    function saveObject(obj) {
        //todo: probably should return promise so we can let the UI
        //wait or add this to a queue
        //todo: maybe use .get api
        service.findObject(obj._id).then(function (results) {
            //this is a temp hack for "second+" save on same object. Probably not viable long-term, but works for
            //now to overcome refresh issue
            //prior revision number
            obj._rev = results.docs[0]._rev;
            return obj;
        })
        .then(service.db.put(obj))
        .then(function () {
            var notification = { type: "success", title: "Save Success", body: obj.fields.title.value };
            $rootScope.$broadcast('notificationEvent:updated', notification);
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    service.getProcs = function () {
        return db.allDocs({ startkey: 'procedure_', endkey: 'procedure_\uffff', include_docs: true, descending: false });
    }

    service.getIssuesForID = function (procID) {
        return db.allDocs({ startkey: procID +'_issue_', endkey: procID + '_issue_\uffff', include_docs: true, descending: false });
    }

    function getSeqNumber() {
        return db.info().then(function (result) {
                //console.log('database seq is ' + result.update_seq);
                return result.update_seq;
            });
    }

    //------------------ just testing here --------------
    var data = {
        hasIndexedDB: null,
        hasWebSQL: null,
        totalRecords: undefined
    };

    service.updateStats = function () { 
        db.info().then(function (result) {
            // handle result
            data.totalRecords = result.doc_count;
        }).catch(function (err) {
            console.log(err);
        });
    };

    service.updateStats();
    service.indexedDB = function () { return data.hasIndexedDB; };
    service.webSQL = function () { return data.hasWebSQL; };
    service.getNumberRecords = function () { return data.totalRecords; };

    new PouchDB('using-idb').info().then(function () {
        //service.hasIndexedDBhtml = '&#10003';
        data.hasIndexedDB = 'yes';
        $rootScope.$broadcast('dbservicedata:updated');
    }).catch(function (err) {
        data.hasIndexedDB = "Nope, got an error: " + err;
    });

    new PouchDB('using-websql', { adapter: 'websql' }).info().then(function () {
        //service.hasWebSQLhtml = '&#10003';
        data.hasWebSQL = 'yes';
        $rootScope.$broadcast('dbservicedata:updated');
    }).catch(function (err) {
        data.hasWebSQL = "Nope, got an error: " + err;
    });
    //------------------ end testing --------------

    return service;
};

databaseSvc.$inject = ['$rootScope'];