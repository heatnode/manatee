var databaseSvc = function ($rootScope, notify, $crypto) {

    var service = {};
    var db;

    //testing, would need safe storage
    service.cryptKeeper = {
        key: '',
        useEncryption: false
    };

    //service.setCryptKey = function (_key) {
    //    cryptKeeper.key = _key;
    //}

    //service.setUseEncryption = function (_useEncryption) {
    //    cryptKeeper.useEncryption = _useEncryption;
    //}


    service.createDB = function () {
        //auto compact cleans up multiple changes to same doc.field
        db = new PouchDB('manateeStore', { auto_compaction: true });
        

        //todo: add encryption functions as dependency
        db.transform({
            incoming: function (doc) {
                // do something to the document before storage
                //Object.keys(doc).forEach(function (field) {
                //    if (field !== '_id' && field !== '_rev') {
                //        doc[field] = encrypt(doc[field]);
                //    }
                //});
                if (service.cryptKeeper.useEncryption && doc.fields.title) {
                    doc.fields.title.value = $crypto.encrypt(doc.fields.title.value, service.cryptKeeper.key);
                }
                //Object.keys(doc).forEach(function (field) {
                //    if (field !== '_id' && field !== '_rev') {
                //        doc[field] = encrypt(doc[field]);
                //    }
                //});
                //var encrypted = $crypto.encrypt('some plain text data', cryptKeeper.key);
                //console.log(encrypted);
                return doc;
            },
            outgoing: function (doc) {
                // do something to the document after retrieval
                //Object.keys(doc).forEach(function (field) {
                //    if (field !== '_id' && field !== '_rev') {
                //        doc[field] = decrypt(doc[field]);
                //    }
                //});
                //Object.keys(doc).forEach(function (field) {
                //    if (field !== '_id' && field !== '_rev') {
                //        doc[field] = decrypt(doc[field]);
                //    }
                //});
                //var encrypted = $crypto.encrypt('some plain text data', cryptKeeper.key);
                //var decrypted = $crypto.decrypt(encrypted, cryptKey);
                //console.log(decrypted);
                if (service.cryptKeeper.useEncryption && doc.fields.title) {
                    doc.fields.title.value = $crypto.decrypt(doc.fields.title.value, service.cryptKeeper.key);
                }
                return doc;
            }
        });

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
                    type: "title", //long term, this would just be string, now using this as a hack to treat it in a special way
                    validations: { required: true }
                },
                code: {
                    label: 'Code',
                    value: "",
                    type: "string",
                    validations: {}
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
                workflow: {
                    label: 'Workflow',
                    value: 0,
                    type: "workflow",
                    options: [{ text: 'Not Started', optvalue: 0 },
                        { text: 'In Progress', optvalue: 1 },
                        { text: 'Completed', optvalue: 2 },
                        { text: 'Reviewed', optvalue: 3 }],
                    validations: {}
                },
                result: {
                    label: '',
                    value: 0,
                    type: "testresult",
                    options: [{ text: 'NONE', optvalue: 0 }, { text: 'pass', optvalue: 1 }, { text: 'fail', optvalue: 2 }],
                    validations: {}
                },

                //category1: {
                //    label: 'Category1',
                //    value: 0,
                //    type: "singleselect",
                //    options: [{ text: 'NONE', optvalue: 1 }, { text: 'cat1', optvalue: 1 }, { text: 'cat2', optvalue: 2 }],
                //    validations: {}
                //},
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
                    label:'Title',
                    value: title,
                    type: "title",
                    validations: { required: true }
                },
                code: {
                    label: 'Code',
                    value: "",
                    type: "string",
                    validations: {}
                },
                release: {
                    label: 'Release',
                    value: false,
                    type: "release",
                    validations: {}
                },
                finding: {
                    label: 'Finding',
                    value: "",
                    type: "html",
                    validations: {}
                },
                levels: {
                    label: 'Levels',
                    value: "",
                    type: "html",
                    validations: {}
                }
            }
        };
        return issue;
    }

    function createWorkpaper(id, parentId, title) {
        var dbID = 'workpaper_' + parentId + "_" + id;
        var wp = {
            _id: dbID,
            type: "workpaper",
            fields: {
                title: {
                    label: 'Title',
                    value: title,
                    type: "title",
                    validations: { required: true }
                },
                code: {
                    label: 'Code',
                    value: "",
                    type: "string",
                    validations: {}
                }
            }
        };
        return wp;
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

    service.addWorkpaper = function (parent, title, file) {
        var workpaper; //using closure so we have the value in the final step
        return getSeqNumber()
            .then(function (id) {
                workpaper = createWorkpaper(id, parent._id, title);
                workpaper._attachments = {
                    filename: {
                        type: file.type,
                        data: file
                    }
                };
                return service.db.put(workpaper);
            })
            .then(function (response) {
                //update proc
                //todo: update counts to be more generic or add to other objects
                parent.WorkpapersCount = parent.WorkpapersCount + 1;
                return saveObject(parent);
            })
            .then(function (updatedParent) {
                return updatedParent;
            })
            .catch(function (err) {
                //todo: let error bubble or throw error if it didn't work
                console.log(err);
            });
    }

    service.getBlob = function (dataobj) {
        return service.db.getAttachment(dataobj._id, 'filename');
    }

    service.saveProc = function (proc) {
        return saveObject(proc);
    }

    service.saveIssue = function (issue) {
        return saveObject(issue);
    }

    service.saveWorkpaper= function (wp) {
        return saveObject(wp);
    }

    function saveObject(obj) {
        // todo: probably should return promise so we can let the UI
        // wait or add this to a queue
        // todo: maybe use .get api
        return service.findObject(obj._id).then(function (results) {
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
        //console.log('getdocs');
        //todo: reconsider sorting
        return db.allDocs({ startkey: 'procedure_\uffff', endkey: 'procedure_', include_docs: true, descending: true });
    }

    service.getIssuesForID = function (procID) {
        return db.allDocs({ startkey: 'issue_' + procID, endkey: 'issue_' + procID +'_\uffff', include_docs: true, descending: false });
    }

    service.getWorkpapersForID = function (procID) {
        return db.allDocs({ startkey: 'workpaper_' + procID, endkey: 'workpaper_' + procID + '_\uffff', include_docs: true, descending: false });
    }

    

    function getSeqNumber() {
        return db.info().then(function (result) {
                return result.update_seq;
            });
    }

    //function findProc
    //// Available selectors are $gt, $gte, $lt, $lte, 
    //// $eq, $ne, $exists, $type, and more
    //db.createIndex({
    //    index: { fields: ['debut'] }
    //}).then(function () {
    //    return db.find({
    //        selector: { debut: { $gte: 1990 } }
    //    });
    //});

    service.data = {
        //hasIndexedDB: null,
        //hasWebSQL: null,
        totalRecords: undefined,
        failingProcs: undefined
    };

    service.updateStats = function () { 
        db.info().then(function (result) {
            // handle result
            //data.totalRecords = result.doc_count;
            return result.doc_count;
        }).then(function (totalrecs) {
            service.data.totalRecords = totalrecs;
            return service.getProcs();
        }).then(function (procObj) {

            //probably can move these to a map/reduce function set
            service.data.failingProcs = statCounter(procObj.rows, 'result', 2);
            service.data.passingProcs = statCounter(procObj.rows, 'result', 1);
            service.data.untestedProcs = statCounter(procObj.rows, 'result', 0);
            service.data.procWF = { 
                NotStarted: statCounter(procObj.rows, 'workflow', 0),
                InProgress: statCounter(procObj.rows, 'workflow', 1),
                Completed: statCounter(procObj.rows, 'workflow', 2),
                Reviewed: statCounter(procObj.rows, 'workflow', 3),
            }

            $rootScope.$broadcast('dbservicedata:updated');
            //procs
        }).catch(function (err) {
            console.log(err);
        });
    };

    function statCounter(ary, compareFieldName, compareValue) {
        return ary.reduce(function (total, obj) {
            return total + ((obj.doc.fields[compareFieldName].value === compareValue) ? 1 : 0);
        }, 0);
    }

    service.updateStats();
    //service.getNumberRecords = function () { return data.totalRecords; };

    //service.indexedDB = function () { return data.hasIndexedDB; };
    //service.webSQL = function () { return data.hasWebSQL; };

    //new PouchDB('using-idb').info().then(function () {
    //    //service.hasIndexedDBhtml = '&#10003';
    //    data.hasIndexedDB = 'yes';
    //    $rootScope.$broadcast('dbservicedata:updated');
    //}).catch(function (err) {
    //    data.hasIndexedDB = "Nope, got an error: " + err;
    //});

    //new PouchDB('using-websql', { adapter: 'websql' }).info().then(function () {
    //    //service.hasWebSQLhtml = '&#10003';
    //    data.hasWebSQL = 'yes';
    //    $rootScope.$broadcast('dbservicedata:updated');
    //}).catch(function (err) {
    //    data.hasWebSQL = "Nope, got an error: " + err;
    //});
    //------------------ end testing --------------

    return service;
};

databaseSvc.$inject = ['$rootScope', 'notify','$crypto'];