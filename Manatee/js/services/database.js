var databaseSvc = function ($rootScope, notify, $crypto, $q) {

    var service = {};
    var db;

    //testing, would need safe storage
    service.cryptKeeper = {
        key: 'test',
        useEncryption: true
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

                //if (service.cryptKeeper.useEncryption && doc._attachments) {
                //    console.log('has attachment');
                //    //debugger;
                //    //todo: work through this
                //    //http://craig-bruce.com/CryptoJS-reprise/
                //    //doc._attachments.filename.data = $crypto.encryptBinary(doc._attachments.filename.data, service.cryptKeeper.key);
                //    $crypto.encryptBinary(doc._attachments.filename.data, service.cryptKeeper.key);
                //}

                //Object.keys(doc).forEach(function (field) {
                //    if (field !== '_id' && field !== '_rev') {
                //        doc[field] = encrypt(doc[field]);
                //    }
                //});

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
                //console.log('in transform');
                if (service.cryptKeeper.useEncryption &&  doc.fields && doc.fields.title) {
                    doc.fields.title.value = $crypto.decrypt(doc.fields.title.value, service.cryptKeeper.key);
                }
                //if (service.cryptKeeper.useEncryption && doc._attachments) {
                //    console.log('decrypt attachment attachment');
                //    doc._attachments.filename.data = $crypto.decryptBinary(doc._attachments.filename.data, service.cryptKeeper.key);
                //}
                return doc;
            }
        });

        //todo: long term don't expose this obviously
        service.db = db;
    }

    service.createDB();

    //todo: figure out where/when to do this. This will create/update the user every tiem the service starts
    //probably should add to "on create" of database
    createTestUser();

    function createTestUser() {
        //var passhash = 'test'
        var passhash = $crypto.getHash('test');
        //console.log('passhash: ' + passhash);
        var id = padId(1);

        var paddedId = padId(id);
        var dbID = 'user_' + id;
        var user = {
            _id: dbID,
            type: "user",
            username:'joe',
            passhash: passhash,
            id:id
        };

        return Promise.resolve().then(function () {
            return service.db.put(user);
        })
        .then(function (result) {
            return user;
        }).catch(function (err) {
            //todo: this will be the error about dupes after the first time
           // console.log(err);
        });
        //todo: maybe check first, and create if missing..
        //db.get('mydoc').then(function (doc) {
        //    // handle doc
        //}).catch(function (err) {
        //    console.log(err);
        //});
    }

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
                    value: null,
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
    }

    service.addProc = function (title) {
        var proc; //using closure so we have the value in the final step
        return getSeqNumber()
            .then(function (id) {
                proc = createProc(id, title);
                return service.db.put(proc);
            })
            .then(function (response) {
                //console.log('add proc');
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

    var fileRead = function (file) {

        var deferred = $q.defer();
        var reader = new FileReader();

        reader.onload = function () {
            deferred.resolve(reader.result);
        };

        reader.readAsDataURL(file);
        //reader.readAsArrayBuffer(file);
        return deferred.promise;
    };

    service.addWorkpaper = function (parent, title, file) {
        var workpaper; //using closure so we have the value in the final step
        return getSeqNumber()
            .then(function (id) {
                workpaper = createWorkpaper(id, parent._id, title);
                
                //workpaper._attachments = {
                //    filename: {
                //        type: file.type,
                //        data: file
                //    }
                //};
                //return service.db.put(workpaper);
                return workpaper;
            })
            .then(function (wp) {
                return fileRead(file);
            })
            .then(function (fileRdrResult) {
                var encryptedFile = $crypto.encryptBinaryURL(fileRdrResult, service.cryptKeeper.key);
                workpaper._attachments = {
                    filename: {
                        type: file.type,
                        data: encryptedFile
                        //data: fileRdrResult
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
        //todo: promise this through a decryption step
        return service.db.getAttachment(dataobj._id, 'filename');
    }

    service.getBlobAsDataURL = function (dataobj) {
        return service.db.get(dataobj._id, { attachments: true }).then(function (doc) {
            var attachment = doc._attachments.filename.data; //base64 enc string
            var decResult = $crypto.decryptBinary(attachment, service.cryptKeeper.key);
            return decResult;
        });
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

    //testing
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }


    service.getProcs = function () {
        //todo: reconsider sorting
        return db.allDocs({ startkey: 'procedure_\uffff', endkey: 'procedure_', include_docs: true, descending: true });
    }

    service.getIssuesForID = function (procID) {
        return db.allDocs({ startkey: 'issue_' + procID, endkey: 'issue_' + procID +'_\uffff', include_docs: true, descending: false });
    }

    service.getWorkpapersForID = function (procID) {
        return db.allDocs({ startkey: 'workpaper_' + procID, endkey: 'workpaper_' + procID + '_\uffff', include_docs: true, descending: false });
    }

    service.getWorkpapersWithAttachments = function () {
        return db.allDocs({
            startkey: 'workpaper_\uffff', endkey: 'workpaper_',
            include_docs: true,
            descending: true,
            attachments: true
        }).then(function (result) {
            //todo: obviously we need to settle on a decrypt pattern..
            if (service.cryptKeeper.useEncryption) {
                result.rows.forEach(function (item) {
                    var attachment = item.doc._attachments.filename.data; //base64 enc string
                    var decResult = $crypto.decryptBinary(attachment, service.cryptKeeper.key);
                    item.doc._attachments.filename.data = decResult;
                });
            }
            return result;
        });
    }

    function padId(id){
        var str = "" + id;
        var pad = "000000";
        var paddedId = pad.substring(0, pad.length - str.length) + str;
        return paddedId;
    }

    function getSeqNumber() {
        return db.info().then(function (result) {
                return padId(result.update_seq);
                //return paddedId;
                //return result.update_seq;
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
    return service;
};

databaseSvc.$inject = ['$rootScope', 'notify','$crypto', '$q'];
