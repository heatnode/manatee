var syncSvc = function (db) {

    var service = {
        name: 'there are those who call me ... sync',
        db:db //obviously, remove thhis, testing for now
        //webSQL: function () { return data.hasWebSQL; }
    };

    service.doSync = function () {
        var procnames = ['Procedure1', 'Procedure2', 'Procedure3', 'Procedur A', 'Procedure B', 'Procedurec'];
        procnames.forEach(function (name) {
            //tood: clear data first (just reset db store)
            db.addProc(name);
        });
    }

    return service;
};

syncSvc.$inject = ['databaseSvc'];