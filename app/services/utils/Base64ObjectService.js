travel_app.service('Base64ObjectService', function () {
    const secretKey = "2b44b0b00fd822d8ce753e54dac3dc4e06c2725f7db930f3b9924468b53194dbccdbe23d7baa5ef5fbc414ca4b2e64700bad60c5a7c45eaba56880985582fba4";

    this.encodeObject = function (obj) {
        if (obj) {
            let jsonString = JSON.stringify(obj);
            return btoa(jsonString + secretKey);
        } else {
            return null;
        }
    };

    this.decodeObject = function (encodedObject) {
        if (encodedObject) {
            let decodedString = atob(encodedObject);

            if (decodedString.endsWith(secretKey)) {
                let jsonString = decodedString.slice(0, -secretKey.length);
                return JSON.parse(jsonString);
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
});
