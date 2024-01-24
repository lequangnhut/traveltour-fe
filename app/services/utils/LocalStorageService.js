travel_app.service('LocalStorageService', function () {
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
});
