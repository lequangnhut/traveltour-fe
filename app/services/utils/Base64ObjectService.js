travel_app.service('Base64ObjectService', function () {
    // Phương thức để mã hóa đối tượng thành chuỗi Base64
    this.encodeObject = function (obj) {
        var jsonString = JSON.stringify(obj);
        return btoa(jsonString);
    };

    // Phương thức để giải mã chuỗi Base64 thành đối tượng
    this.decodeObject = function (encodedObject) {
        if (encodedObject) {
            var jsonString = atob(encodedObject);
            return JSON.parse(jsonString);
        } else {
            return null;
        }
    };
})