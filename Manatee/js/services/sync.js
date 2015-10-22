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
            //var procnames = ['Procedure 1', 'Procedure 2'];
            var i = db.getNumberRecords();
            procnames.forEach(function (name) {
                i = i + 1;
                db.addProc(i, name);
            });
            //for total recs
            db.updateStats();
        });
    }

    return service;
};

syncSvc.$inject = ['databaseSvc','$q'];