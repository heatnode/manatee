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

                encryptBinary: function (message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.encrypt(
                            CryptoJS.enc.Latin1.parse(message),
                            CryptoJS.enc.Latin1.parse(key)
                        );

                },

                
                decryptBinary: function (message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Latin1);

                },

                getHash: function (message) {
                    var hash = CryptoJS.SHA256(message);
                    return hash.toString(CryptoJS.enc.Base64);
                }

            }
        }];
    });