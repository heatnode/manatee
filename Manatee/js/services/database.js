var databaseSvc = function ($rootScope) {

    var service = {};
    var db;

    service.createDB = function () {
        db = new PouchDB('manateeStore');
        //todo: long term don't expose this obviously
        service.db = db;
    }

    service.createDB();

    service.findProc = function (id) {
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
        var dbID = 'procedure/' + id;

        var proc = {
            _id: dbID,
            type: "procedure",
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

    service.saveProc = function (proc) {
        //todo: probably should return promise so we can let the UI
        //wait or add this to a queue
        //todo: maybe use .get api
        service.findProc(proc._id).then(function (results) {
            //this is a temp hack for "second+" save on same object. Probably not viable long-term, but works for
            //now to overcome refresh issue
            //prior revision number
            proc._rev = results.docs[0]._rev;
            return proc;
        })
        .then(service.db.put(proc))
        .then(function() {
            var notification = { type: "success", title: "Save Success", body: proc.fields.title.value };
            $rootScope.$broadcast('notificationEvent:updated', notification);
        })
        .catch(function (err) {
            console.log(err);
        });

    }

    service.getProcs = function () {
        return db.allDocs({ include_docs: true, descending: true });
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