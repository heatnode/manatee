var databaseSvc = function ($rootScope, notify) {

    var service = {};
    var db;

    service.createDB = function () {
        //auto compact cleans up multiple changes to same doc.field
        db = new PouchDB('manateeStore', { auto_compaction: true }); 
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
            //db = new PouchDB('manateeStore');
            //service.db = db;
            service.createDB();
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
                    label:'Title',
                    //later add .label for normalized label
                    value: title,
                    type: "string",
                    validations: { required: true }
                },
                completed: {
                    label: 'Completed',
                    value: false,
                    type: "bool",
                    validations: {}
                },
                datedue: {
                    label: 'Date Due',
                    value: "",
                    type: "date",
                    validations: {}
                },
                result: {
                    label: '',
                    value: 0,
                    type: "testresult",
                    options: [{ text: 'NONE', optvalue: 0 }, { text: 'pass', optvalue: 1 }, { text: 'fail', optvalue: 2 }],
                    validations: {}
                },
                category1: {
                    label: 'Category1',
                    value: 0,
                    type: "singleselect",
                    options: [{ text: 'NONE', optvalue: 1 }, { text: 'cat1', optvalue: 1 }, { text: 'cat2', optvalue: 2 }],
                    validations: {}
                },
                description: {
                    label: 'Description',
                    value: "",
                    type: 'html',
                    validations: {}
                },
                //example of field with spaces, may not need if we do label prop
                "Record of Work": {
                    label: 'Record of Work',
                    value: "",
                    type: 'html',
                    validations: {}
                }
            }
        };
        return proc;
    }

    function createIssue(id, procId, title) {
        var dbID = 'issue_' + procId + "_" + id;
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

    function createWorkpaper(id, parentId, title) {
        //db.put({
        //    _id: 'meowth',
        //    _attachments: {
        //        'meowth.png': {
        //            content_type: 'image/png',
        //            data: 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAIAAAB0Xu9BAAAABGdBTUEAALGPC/xhBQAAAuNJREFUWEetmD1WHDEQhDdxRMYlnBFyBIccgdQhKVcgJeQMpE5JSTd2uqnvIGpVUqmm9TPrffD0eLMzUn+qVnXPwiFd/PP6eLh47v7EaazbmxsOxjhTT88z9hV7GoNF1cUCvN7TTPv/gf/+uQPm862MWTL6fff4HfDx4S79/oVAlAUwqOmYR0rnazuFnhfOy/ErMKkcBFOr1vOjUi2MFn4nuMil6OPh5eGANLhW3y6u3aH7ijEDCxgCvzFmimvc95TekZLyMSeJC68Bkw0kqUy1K87FlpGZqsGFCyqEtQNDdFUtFctTiuhnPKNysid/WFEFLE2O102XJdEE+8IgeuGsjeJyGHm/xHvQ3JtKVsGGp85g9rK6xMHtvHO9+WACYjk5vkVM6XQ6OZubCJvTfPicYPeHO2AKFl5NuF5UK1VDUbeLxh2BcRGKTQE3irHm3+vPj6cfCod50Eqv5QxtwBQUGhZhbrGVuRia1B4MNp6edwBxld2sl1splfHCwfsvCZfrCQyWmX10djjOlWJSSy3VQlS6LmfrgNvaieRWx1LZ6s9co+P0DLsy3OdLU3lWRclQsVcHJBcUQ0k9/WVVrmpRzYQzpgAdQcAXxZzUnFX3proannrYH+Vq6KkLi+UkarH09mC8YPr2RMWOlEqFkQClsykGEv7CqCUbXcG8+SaGvJ4a8d4y6epND+pEhxoN0vWUu5ntXlFb5/JT7JfJJqoTdy9u9qc7ax3xJRHqJLADWEl23cFWl4K9fvoaCJ2BHpmJ3s3z+O0U/DmzdMjB9alWZtg4e3yxzPa7lUR7nkvxLHO9+tvJX3mtSDpwX8GajB283I8R8a7D2MhUZr1iNWdny256yYLd52DwRYBtRMvE7rsmtxIUE+zLKQCDO4jlxB6CZ8M17GhuY+XTE8vNhQiIiSE82ZsGwk1pht4ZSpT0YVpon6EvevOXXH8JxVR78QzNuamupW/7UB7wO/+7sG5V4ekXb4cL5Lyv+4IAAAAASUVORK5CYII='
        //        }
        //    }
        //}).then(function () {
        //    return db.getAttachment('meowth', 'meowth.png');
        //}).then(function (blob) {
        //    var url = URL.createObjectURL(blob);
        //    var img = document.createElement('img');
        //    img.src = url;
        //    document.body.appendChild(img);
        //}).catch(function (err) {
        //    console.log(err);
        //});
    }

    service.addProc = function (title) {
        var proc; //using closure so we have the value in the final step
        return getSeqNumber()
            .then(function (id) {
                proc = createProc(id, title);
                return service.db.put(proc);
            })
            .then(function (response) {
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

    service.saveIssue = function (issue) {
        saveObject(issue);
    }

    function saveObject(obj) {
        // todo: probably should return promise so we can let the UI
        // wait or add this to a queue
        // todo: maybe use .get api
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
            notify.add(notification);
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    service.getProcs = function () {
        //todo: reconsider sorting
        return db.allDocs({ startkey: 'procedure_\uffff', endkey: 'procedure_', include_docs: true, descending: true });
    }

    service.getIssuesForID = function (procID) {
        return db.allDocs({ startkey: 'issue_' + procID, endkey: 'issue_' + procID +'_\uffff', include_docs: true, descending: false });
    }

    function getSeqNumber() {
        return db.info().then(function (result) {
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

databaseSvc.$inject = ['$rootScope', 'notify'];