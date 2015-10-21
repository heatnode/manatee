var syncSvc = function (db) {

    var service = {
        name: 'there are those who call me ... sync',
        db:db //obviously, remove thhis, testing for now
    };

    service.doSync = function () {
        var procnames = ['Procedure1', 'Procedure2', 'Procedure3', 'Procedur A', 'Procedure B', 'Procedurec'];
        var i = db.getNumberRecords();
        procnames.forEach(function (name) {
            //tood: clear data first (just reset db store)
            i = i + 1;
            db.addProc(i, name);
        });
        //for total recs
        db.updateStats();
    }

    return service;
};

syncSvc.$inject = ['databaseSvc'];