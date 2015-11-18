angular.module('mdo-angular-cryptography', [])
    .provider('$crypto', function CryptoKeyProvider() {
        var cryptoKey;

        this.setCryptographyKey = function(value) {
            cryptoKey = value;
        };

        this.$get = [function(){
            return {
                getCryptoKey: function() {
                    return cryptoKey
                },

                encrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.encrypt(message, key ).toString();
                },

                decrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
                },

                encryptBinaryArrayBuffer: function (arrayBuffer, key, filetype) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }
                    var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
                        var encrypted = CryptoJS.AES.encrypt(
                            //convert to a word array via CryptoJS. 'this' is the file reader.
                            //arrayBufferToWordArray(this.result),
                            wordArray,
                            //our server generated key happens to be in Base64. 
                            //We need to convert it to a word array
                            CryptoJS.enc.Base64.parse(key));

                        var blob = new Blob([encrypted], { type: filetype });
                        return blob;

                    //debugger;
                    //var reader = new FileReader();
                    //reader.onload = function (e) {
                    //    debugger;
                    //    var encrypted = CryptoJS.AES.encrypt(
                    //        //convert to a word array via CryptoJS. 'this' is the file reader.
                    //        //arrayBufferToWordArray(this.result),
                    //        e.target.result,
                    //        //our server generated key happens to be in Base64. 
                    //        //We need to convert it to a word array
                    //        CryptoJS.enc.Base64.parse(key));

                    //    var blob = new Blob([encrypted], { type: file.type });
                    //    console.log('created blob');
                    //    //now give back to Fine Uploader to continue upload to server.
                    //    //or you could store it locally via FileWriter
                    //};
                    //console.log('about to read');
                    ////reader.readAsArrayBuffer(file);
                    //reader.readAsDataURL(file);
                    //console.log('done reading as url');
                    //return CryptoJS.AES.encrypt(
                    //        CryptoJS.enc.Latin1.parse(message),
                    //        CryptoJS.enc.Latin1.parse(key)
                    //    );
                    //reader.onload = function (e) {

                    //    // Use the CryptoJS library and the AES cypher to encrypt the 
                    //    // contents of the file, held in e.target.result, with the password

                    //    var encrypted = CryptoJS.AES.encrypt(e.target.result, password);

                    //    // The download attribute will cause the contents of the href
                    //    // attribute to be downloaded when clicked. The download attribute
                    //    // also holds the name of the file that is offered for download.

                    //    a.attr('href', 'data:application/octet-stream,' + encrypted);
                    //    a.attr('download', file.name + '.encrypted');

                    //    step(4);
                    //};

                    //// This will encode the contents of the file into a data-uri.
                    //// It will trigger the onload handler above, with the result

                    //reader.readAsDataURL(file);


                },

                encryptBinaryURL: function (urlbase64, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    var encrypted = CryptoJS.AES.encrypt(urlbase64, key);

                    return encrypted.toString();
                },
                
                decryptBinary: function (message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    //return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Base64);
                    var decrypt = CryptoJS.AES.decrypt(message, key);
                    return decrypt.toString(CryptoJS.enc.Latin1);
                },

                getHash: function (message) {
                    var hash = CryptoJS.SHA256(message);
                    return hash.toString(CryptoJS.enc.Base64);
                }

            }
        }];
    });