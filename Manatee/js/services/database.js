var databaseSvc = function ($rootScope) {

    var service = {
        indexedDB: function () { return data.hasIndexedDB; },
        webSQL: function () { return data.hasWebSQL; }
    };

    var data = {
        hasIndexedDB: null,
        hasWebSQL: null
    };

    service.db = new PouchDB('manateeStore');

    service.addProc = function (text) {
        var proc = {
            _id: new Date().toISOString()+text,
            title: text,
            completed: false,
            type: "procedure",
            datedue: null,
            category1: {
                value: 0,
                options: [{ text: 'cat1', optvalue: 1 }, { text: 'cat2', optvalue: 2 }]
                }
        };

        service.db.put(proc, function callback(err, result) {
            if (!err) {
                console.log('Successfully entered proc');
            }
        });
        //todo: let error bubble or throw error if it didn't work
        //also, may need to deal with async aspect here as well
        return proc;
    }

    service.getProcs = function () {
        return service.db.allDocs({ include_docs: true, descending: true });
    }

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

    return service;
};

databaseSvc.$inject = ['$rootScope'];