var syncSvc = function (db, $q) {

    var service = {
        name: 'there are those who call me ... sync',
        db:db //obviously, remove thhis, testing for now
    };

    service.doSync = function () {
        //note reInitDB returns a promise but IS NOT a promise itself
        //consider what we prefer ie woul
        $q.when(db.reInitDB()).then(function () {
            var procnames = ['Procedure1', 'Procedure2', 'Procedure3', 'Procedur A', 'Procedure B', 'Procedurec'];
            addProcFactories = [];
            procnames.forEach(function (name) {
                //creates list of functions that will return a promise when called
                addProcFactories.push(addFactory(name));
            });

            return executeSequentially(addProcFactories);

        }).then(db.updateStats());
    }

    function addFactory(name) {
        return function () {
            return db.addProc(name);
        }
    }

    function executeSequentially(promiseFactories) {
        var result = Promise.resolve();
        promiseFactories.forEach(function (promiseFactory) {
            result = result.then(promiseFactory);
        });
        return result;
    }

    return service;

    //sequential code that DID NOT work, goes in parallel even though it may not look like it should
    //var procnames = ['Procedure 1', 'Procedure 2'];
    //var promise = new Promise(function () { return true });
    //procnames.forEach(function (name) {
    //    promise = promise.then(db.addProc(name));
    //});
    //return promise;
};

syncSvc.$inject = ['databaseSvc','$q'];