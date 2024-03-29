travel_app.service('LocalStorageService', function () {
    const defaultKey = 'HaCK_hO_AnH_Cai_eM';

    this.set = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    this.get = function (key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    };

    this.remove = function (key) {
        localStorage.removeItem(key);
    };

    this.clearAll = function () {
        localStorage.clear();
    };

    this.encryptData = function (data, customKey) {
        const combinedKey = customKey + defaultKey;

        if (!data) {
            console.error('dữ liệu không xác định hoặc null');
            return null;
        }

        return CryptoJS.AES.encrypt(JSON.stringify(data), combinedKey).toString();
    };

    this.decryptData = function (encryptedData, customKey) {
        const combinedKey = customKey + defaultKey;

        try {
            if (!encryptedData) return null;

            let bytes = CryptoJS.AES.decrypt(encryptedData, combinedKey);
            let decryptedText = bytes.toString(CryptoJS.enc.Utf8);

            return decryptedText ? JSON.parse(decryptedText) : null;
        } catch (e) {
            console.error('lỗi giải mã dữ liệu:', e);
            return null;
        }
    };

    this.encryptLocalData = (data, localKey, customKey) => {
        const combinedKey = customKey + defaultKey;

        if (!data) {
            console.error('dữ liệu không xác định hoặc null');
            return null;
        }

        let encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), combinedKey).toString();
        return localStorage.setItem(localKey, JSON.stringify(encryptData));
    };

    this.decryptLocalData = (localKey, customKey) => {
        const combinedKey = customKey + defaultKey;

        try {
            const value = localStorage.getItem(localKey);
            let encryptedData = value ? JSON.parse(value) : null;

            if (!encryptedData) return null;

            let bytes = CryptoJS.AES.decrypt(encryptedData, combinedKey);
            let decryptedText = bytes.toString(CryptoJS.enc.Utf8);

            return decryptedText ? JSON.parse(decryptedText) : null;
        } catch (e) {
            console.error('lỗi giải mã dữ liệu:', e);
            return null;
        }
    };

});
