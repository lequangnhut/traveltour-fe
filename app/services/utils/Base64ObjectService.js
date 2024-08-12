travel_app.service('Base64ObjectService', function () {
    const secretKey = "Kh@a_B@0-M@kt";

    this.encodeObject = function (obj) {
        if (obj) {
            let jsonString = JSON.stringify(obj);
            let encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
            return btoa(encryptedData);
        } else {
            return null;
        }
    };

    this.decodeObject = function (encodedObject) {
        if (encodedObject) {
            let decryptedData = CryptoJS.AES.decrypt(atob(encodedObject), secretKey).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData);
        } else {
            return null;
        }
    };
});
