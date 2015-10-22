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

    //db.destroy().then(function (response) {
    //    // success
    //}).catch(function (err) {
    //    console.log(err);
    //});
    service.reInitDB = function () {
        return db.destroy().then(function () {
            db = new PouchDB('manateeStore');
            service.db = db; //not sure we need this
        })
    };

    service.addProc = function (id, text) {
        var proc = {
            _id: id+'procedure', //just hacking something in
            title: text,
            completed: false,
            type: "procedure",
            datedue: null,
            result: {
                value: 0,
                type:'testresult',
                options: [{ text: 'NONE', optvalue: 0 }, { text: 'pass', optvalue: 1 }, { text: 'fail', optvalue: 2 }]
            },
            category1: {
                value: 0,
                type:'singleselect',
                options: [{ text: 'NONE', optvalue: 1 }, { text: 'cat1', optvalue: 1 }, { text: 'cat2', optvalue: 2 }]
            }
        };

        service.db.put(proc, function callback(err, result) {
            if (!err) {
                //console.log('Successfully entered proc');
            }
        });
        //todo: let error bubble or throw error if it didn't work
        //also, may need to deal with async aspect here as well
        return proc;
    }

    service.saveProc = function (proc) {

        service.findProc(proc._id).then(function (results) {
                console.log('found saved proc');
                //console.log(results.docs[0]);
                return results.docs[0]._rev;
        }).then(function (prior_rev) {
            console.log(prior_rev);
            //this is a temp hack for "second+" save on same object. Probably not viable long-term, but works for
            //now to overcome refresh issue
            proc._rev = prior_rev;
            service.db.put(proc, function callback(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully saved proc');
                    var notification = { type: "success", title: "Save Success", body: proc.title };
                    $rootScope.$broadcast('notificationEvent:updated', notification);
                }
            });
        });


        //todo: let error bubble or throw error if it didn't work
        //also, may need to deal with async aspect here as well
        //return proc;
    }

    service.getProcs = function () {
        return db.allDocs({ include_docs: true, descending: true });
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