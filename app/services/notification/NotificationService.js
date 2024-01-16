travel_app.service('NotificationService', function () {
    const notificationKey = 'notification';

    this.setNotification = function (type, message) {
        const notification = {type: type, message: message};
        localStorage.setItem(notificationKey, JSON.stringify(notification));
    };

    this.getNotification = function () {
        return JSON.parse(localStorage.getItem(notificationKey));
    };

    this.clearNotification = function () {
        localStorage.removeItem(notificationKey);
    };
});
